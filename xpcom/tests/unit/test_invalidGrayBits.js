








function run_test() {
  
  
  let wm = new WeakMap();
  let key = {};
  wm.set(key, {});
  Cu.getJSTestingFunctions().minorgc();

  
  Cu.getJSTestingFunctions().setGrayBitsInvalid();

  
  Cu.forceCC();
}
