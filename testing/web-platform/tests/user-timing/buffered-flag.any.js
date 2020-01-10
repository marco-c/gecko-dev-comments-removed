async_test(t => {
  
  
  new PerformanceObserver(() => {
    
    new PerformanceObserver(t.step_func_done(list => {
      const entries = list.getEntries();
      assert_equals(entries.length, 1, 'There should be 1 mark entry.');
      assert_equals(entries[0].entryType, 'mark');
    })).observe({type: 'mark', buffered: true});
  }).observe({entryTypes: ['mark']});
  performance.mark('foo');
}, 'PerformanceObserver with buffered flag sees previous marks');

async_test(t => {
  
  
  new PerformanceObserver(() => {
    
    new PerformanceObserver(t.step_func_done(list => {
      const entries = list.getEntries();
      assert_equals(entries.length, 1, 'There should be 1 measure entry.');
      assert_equals(entries[0].entryType, 'measure');
    })).observe({type: 'measure', buffered: true});
  }).observe({entryTypes: ['measure']});
  performance.measure('bar');
}, 'PerformanceObserver with buffered flag sees previous measures');
