


promise_test(async test => {
    await promise_rejects_js(test, TypeError,
      import("./module.json"),
      "Dynamic import of a JSON module without a type attribute should fail");

    
    
    const result = await import("./module.json", { with: { type: "json" } });
    assert_true(result.default.test);
}, "Importing a specifier that previously failed due to an incorrect type attribute can succeed if the correct attribute is later given");

promise_test(async test => {
    
    
    const result = await import("./module.json#2", { with: { type: "json" } });
    assert_true(result.default.test);

    await promise_rejects_js(test, TypeError,
      import("./module.json#2"),
      "Dynamic import should fail with the type attribute missing even if the same specifier previously succeeded");
}, "Importing a specifier that previously succeeded with the correct type attribute should fail if the incorrect attribute is later given");

promise_test(async test => {
    const uuid_token = token();
    
    await fetch(`../serve-custom-response.py?key=${uuid_token}&action=set&content-type=application/json`, { cache: 'no-cache' });
    const result_json = await import(`../serve-custom-response.py?key=${uuid_token}`, { with: { type: "json" } });
    assert_equals(result_json.default.hello, "world");

    
    await fetch(`../serve-custom-response.py?key=${uuid_token}&action=set&content-type=application/javascript`, { cache: 'no-cache' });
    
    const result_js = await import(`../serve-custom-response.py?key=${uuid_token}`);
    assert_equals(result_js.default, "hello");
}, "Two modules of different type with the same specifier can load if the server changes its responses");

promise_test(async test => {
    const uuid_token = token();
    
    await fetch(`../serve-custom-response.py?key=${uuid_token}&action=set&content-type=application/javascript`, { cache: 'no-cache' });
    await promise_rejects_js(test, TypeError,
      import(`../serve-custom-response.py?key=${uuid_token}`, { with: { type: "json" } }),
      "Dynamic import of JSON with a JS type content should fail");

    
    await fetch(`../serve-custom-response.py?key=${uuid_token}&action=set&content-type=application/json`, { cache: 'no-cache' });
    
    const result_json = await import(`../serve-custom-response.py?key=${uuid_token}`, { with: { type: "json" } });
    assert_equals(result_json.default.hello, "world");
}, "An import should succeed even if the same specifier/module type pair previously failed due to a MIME type mismatch");

promise_test(async test => {
    const uuid_token = token();
    
    await fetch(`../serve-custom-response.py?key=${uuid_token}&action=set&code=404`, { cache: 'no-cache' });
    await promise_rejects_js(test, TypeError,
      import(`../serve-custom-response.py?key=${uuid_token}`, { with: { type: "json" } }),
      "Dynamic import of JSON should fail with a 404 response");

    
    await fetch(`../serve-custom-response.py?key=${uuid_token}&action=set&code=200&content-type=application/json`, { cache: 'no-cache' });
    
    const result_json = await import(`../serve-custom-response.py?key=${uuid_token}`, { with: { type: "json" } });
    assert_equals(result_json.default.hello, "world");
}, "An import should succeed even if the same specifier/module type pair previously failed due to a HTTP error");

promise_test(async test => {
    const uuid_token = token();
    
    await fetch(`../serve-custom-response.py?key=${uuid_token}&action=set&network-error=true`, { cache: 'no-cache' });
    await promise_rejects_js(test, TypeError,
      import(`../serve-custom-response.py?key=${uuid_token}`, { with: { type: "json" } }),
      "Dynamic import of JSON should fail with a network error");

    
    await fetch(`../serve-custom-response.py?key=${uuid_token}&action=set&network-error=false&code=200&content-type=application/json`, { cache: 'no-cache' });
    
    const result_json = await import(`../serve-custom-response.py?key=${uuid_token}`, { with: { type: "json" } });
    assert_equals(result_json.default.hello, "world");
}, "An import should succeed even if the same specifier/module type pair previously failed due to a network error");

promise_test(async test => {
    const uuid_token = token();
    
    await fetch(`../serve-custom-response.py?key=${uuid_token}&action=set&content-type=application/json`, { cache: 'no-cache' });
    const result_json = await import(`../serve-custom-response.py?key=${uuid_token}`, { with: { type: "json" } });
    assert_equals(result_json.default.hello, "world");
    const visit_counter = await fetch(`../serve-custom-response.py?key=${uuid_token}&action=stat`, { cache: 'no-cache' });
    assert_equals(await visit_counter.text(), "1");

    
    
    await fetch(`../serve-custom-response.py?key=${uuid_token}&action=set&content-type=application/javascript`, { cache: 'no-cache' });
    const result_json_2 = await import(`../serve-custom-response.py?key=${uuid_token}`, { with: { type: "json" } });
    assert_equals(result_json_2.default.hello, "world");
    const visit_counter_2 = await fetch(`../serve-custom-response.py?key=${uuid_token}&action=stat`, { cache: 'no-cache' });
    assert_equals(await visit_counter_2.text(), "1");
}, "If an import previously succeeded for a given specifier/module type attribute pair, future uses of that pair should yield the same result");

promise_test(async test => {
    const uuid_token = token();
    await fetch(`../serve-custom-response.py?key=${uuid_token}&action=set&content-type=application/json`, { cache: 'no-cache' });
    const imports = [];
    for (let i = 0; i < 5; i++) {
        imports.push(import(`../serve-custom-response.py?key=${uuid_token}`, { with: { type: "json" } }));
    }
    const results = await Promise.all(imports);
    for (const result of results) {
        assert_equals(result.default.hello, "world");
    }
    const visit_counter = await fetch(`../serve-custom-response.py?key=${uuid_token}&action=stat`, { cache: 'no-cache' });
    assert_equals(await visit_counter.text(), "1");
}, "Multiple import calls with the same specifier should be joined into a single fetch");
