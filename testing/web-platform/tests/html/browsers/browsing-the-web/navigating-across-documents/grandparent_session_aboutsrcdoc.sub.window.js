


function run_test(cross_origin, sandbox, name) {
  promise_test(async test => {
    let child_frame = document.createElement('iframe');

    let load_count = 0;
    const test_finished = new Promise(resolve => {
      window.onmessage = (e) => {
        load_count++;
        if (load_count == 1) {
          
          assert_equals(e.data, "about:srcdoc");
          
          child_frame.src = "./resources/child2.html";
        } else if (load_count == 2) {
          
          
          assert_equals(e.data, child_frame.src);
          history.back();
        } else if (load_count == 3) {
          
          assert_equals(e.data, "about:srcdoc");
          resolve();
        }
      };
    });
    let cmd_str = "load grandchild";
    if (sandbox) {
      cmd_str += " sandbox";
    }

    
    
    let filename = "child_with_static_srcdoc.html";
    if (sandbox) {
      let filename = "child_with_static_sandbox_srcdoc.html"
    }

    const child_relative_path = './resources/' + filename;
    if (cross_origin) {
      const new_origin = new URL('http://{{hosts[][www]}}:{{ports[http][1]}}');
      const child_url_same_site = new URL(child_relative_path, location.href);
      child_frame.src = new_origin.origin + child_url_same_site.pathname;
    } else {
      child_frame.src = child_relative_path;
    }

    document.body.appendChild(child_frame);
    await test_finished;

    
    document.body.removeChild(child_frame);
  }, name);
}

onload = () => {
  
  
  
  
  run_test(cross_origin = true, sandbox = false,
           name = "Grandparent with cross-origin srdoc grandchild session");
  run_test(cross_origin = true, sandbox = true,
           name = "Grandparent with cross-origin sandboxed srdoc grandchild session");
  run_test(cross_origin = false, sandbox = false,
           name = "Grandparent with same-origin srdoc grandchild session");
  run_test(cross_origin = false, sandbox = true,
           name = "Grandparent with same-origin sandboxed srdoc grandchild session");
}
