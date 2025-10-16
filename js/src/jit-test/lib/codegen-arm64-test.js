


load(libdir + "codegen-test-common.js");


var arm64_prefix = `
mov     x29, sp
mov     x28, sp(
str     x23, \\[x29, #16\\])?
`;


var arm64_suffix = `
ldr     x30, \\[sp, #8\\]
ldr     x29, \\[sp\\]
`;





function codegenTestARM64_adhoc(module_text, export_name, expected, options = {}) {
    assertEq(hasDisassembler(), true);

    let ins = wasmEvalText(module_text, {}, options.features);
    if (options.instanceBox)
        options.instanceBox.value = ins;
    let output = wasmDis(ins.exports[export_name], {tier:"ion", asString:true});

    const expected_initial = expected;
    if (!options.no_prefix)
        expected = arm64_prefix + '\n' + expected;
    if (!options.no_suffix)
        expected = expected + '\n' + arm64_suffix;
    expected = fixlines(expected, `${HEX}{8}`);

    const output_matches_expected = output.match(new RegExp(expected)) != null;
    if (!output_matches_expected) {
        print("---- codegen-arm64-test.js: TEST FAILED ----");
    }
    if (options.log && output_matches_expected) {
        print("---- codegen-arm64-test.js: TEST PASSED ----");
    }
    if (options.log || !output_matches_expected) {
        print("---- module text");
        print(module_text);
        print("---- actual");
        print(output);
        print("---- expected (initial)");
        print(expected_initial);
        print("---- expected (as used)");
        print(expected);
        print("----");
    }

    assertEq(output_matches_expected, true);
}

