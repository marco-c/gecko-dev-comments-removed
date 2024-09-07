





"use strict";
add_task(async function testTracingValues() {
  await pushPref("devtools.debugger.features.javascript-tracing", true);

  
  const jsCode = `function foo() { bar(1, ["array"], { attribute: 3 }, BigInt(4), Infinity, Symbol("6"), "7"); }; function bar(a, b, c) {}`;
  const dbg = await initDebuggerWithAbsoluteURL(
    "data:text/html," + encodeURIComponent(`<script>${jsCode}</script>`)
  );

  
  await toggleJsTracerMenuItem(dbg, "#jstracer-menu-item-console");

  await toggleJsTracerMenuItem(dbg, "#jstracer-menu-item-log-values");

  await toggleJsTracer(dbg.toolbox);

  invokeInTab("foo");

  await hasConsoleMessage(dbg, "λ foo()");
  await hasConsoleMessage(dbg, "λ bar");
  const { value } = await findConsoleMessage(dbg, "λ bar");
  is(
    value,
    `⟶ interpreter λ bar(1, \nArray [ "array" ]\n, \nObject { attribute: 3 }\n, 4n, Infinity, Symbol("6"), "7")`,
    "The argument were printed for bar()"
  );

  
  Services.prefs.clearUserPref("devtools.debugger.javascript-tracing-values");
});
