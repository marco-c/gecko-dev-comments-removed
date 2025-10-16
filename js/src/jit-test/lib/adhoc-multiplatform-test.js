




















































load(libdir + "codegen-test-common.js");


const knownArchs = ["x64", "x86", "arm64", "arm"];


const requiredArchs = ["x64", "x86", "arm64"];



const archOptions =
      {x64: {
           encoding: `(?:${HEX}{2} )*`,
           
           
           prefix: `mov %rsp, %rbp(
                    movq %r14, (0x10|0x30)\\(%rbp\\))?`,
           suffix: `pop %rbp`
       },
       x86: {
           encoding: `(?:${HEX}{2} )*`,
           
           
           
           
           
           prefix: `mov %esp, %ebp(
                    movl %esi, 0x08\\(%rbp\\))?(
                    mov \\$0xDEADBEEF, %e.x)?`,
           
           suffix: `pop %.bp`
       },
       arm64: {
           encoding: `${HEX}{8}`,
           
           
           prefix: `mov x29, sp
                    mov x28, sp(
                    str x23, \\[x29, #16\\])?`,
           suffix: `ldr x30, \\[sp, #8\\]
                    ldr x29, \\[sp\\]`
       },
       arm: {
           encoding: `${HEX}{8} ${HEX}{8}`,
           
           
           prefix: `str fp, \\[sp, #-4\\]!
                    mov fp, sp(
                    str r9, \\[fp, #\\+8\\])?`,
           suffix: `ldr fp, \\[sp\\], #\\+4`
       }
      };













function promoteArchSpecificOptions(options, archName) {
    assertEq(true, knownArchs.some(a => archName == a));
    if (options.hasOwnProperty(archName)) {
        let archOptions = options[archName];
        for (optName in archOptions) {
            options[optName] = archOptions[optName];
            if (options.log) {
                print("---- adding " + archName + "-specific option {"
                      + optName + ":" + archOptions[optName] + "}");
            }
        }
    }
    for (a of knownArchs) {
        delete options[a];
    }
    if (options.log) {
        print("---- final options");
        for (optName in options) {
            print("{" + optName + ":" + options[optName] + "}");
        }
    }
    return options;
}


function codegenTestMultiplatform_adhoc(module_text, export_name,
                                        expectedAllTargets, options = {}) {
    assertEq(hasDisassembler(), true);

    
    
    assertEq(true,
             requiredArchs.every(a => expectedAllTargets.hasOwnProperty(a)));

    
    
    let genX64   = getBuildConfiguration("x64");
    let genX86   = getBuildConfiguration("x86");
    let genArm64 = getBuildConfiguration("arm64");
    let genArm   = getBuildConfiguration("arm");
    
    if (genX64 && genArm64 && getBuildConfiguration("arm64-simulator")) {
        genX64 = false;
    }
    if (genX86 && genArm && getBuildConfiguration("arm-simulator")) {
        genX86 = false;
    }

    
    assertEq(1, [genX64, genX86, genArm64, genArm].map(x => x ? 1 : 0)
                                                  .reduce((a,b) => a+b, 0));

    
    
    let archName = "";
    if (genX64) {
        archName = "x64";
    } else if (genX86) {
        archName = "x86";
    } else if (genArm64) {
        archName = "arm64";
    } else if (genArm) {
        archName = "arm";
    }
    if (options.log) {
        print("---- testing for architecture \"" + archName + "\"");
    }
    
    assertEq(true, archName.length > 0);

    
    
    options = promoteArchSpecificOptions(options, archName);

    
    assertEq(true, archOptions.hasOwnProperty(archName));
    let encoding = archOptions[archName].encoding;
    let prefix = archOptions[archName].prefix;
    let suffix = archOptions[archName].suffix;
    assertEq(true, encoding.length > 0, `bad instruction encoding: ${encoding}`);
    assertEq(true, prefix.length > 0, `bad prefix: ${prefix}`);
    assertEq(true, suffix.length > 0, `bad suffix: ${suffix}`);

    
    
    
    let expected = "";
    if (expectedAllTargets.hasOwnProperty(archName)) {
        expected = expectedAllTargets[archName];
    } else {
        
        assertEq(archName, "arm");
        if (options.log) {
            print("---- !! no expected output for target, skipping !!");
        }
        return;
    }

    
    
    expectedInitial = expected;
    if (!options.no_prefix) {
        expected = prefix + '\n' + expected;
    }
    if (!options.no_suffix) {
        expected = expected + '\n' + suffix;
    }
    if (genArm) {
        
        
        
        
        
        let newExpected = "";
        let pattern = /^[0-9a-fA-F]{8} /;
        for (line of expected.split(/\n+/)) {
            
            
            while (line.match(/^\s/)) {
                line = line.slice(1);
            }
            if (line.match(pattern)) {
                line = line.slice(0,9) + line;
            }
            newExpected = newExpected + line + "\n";
        }
        expected = newExpected;
    }
    expected = fixlines(expected, encoding);

    
    let ins = wasmEvalText(module_text, {}, options.features);
    if (options.instanceBox)
        options.instanceBox.value = ins;
    let output = wasmDis(ins.exports[export_name], {tier:"ion", asString:true});

    
    let output_matches_expected = output.match(new RegExp(expected)) != null;
    if (!output_matches_expected) {
        print("---- adhoc-tier1-test.js: TEST FAILED ----");
    }
    if (options.log && output_matches_expected) {
        print("---- adhoc-tier1-test.js: TEST PASSED ----");
    }
    if (options.log || !output_matches_expected) {
        print("---- module text");
        print(module_text);
        print("---- actual");
        print(output);
        print("---- expected (initial)");
        print(expectedInitial);
        print("---- expected (as used)");
        print(expected);
        print("----");
    }

    
    assertEq(output_matches_expected, true);
}
