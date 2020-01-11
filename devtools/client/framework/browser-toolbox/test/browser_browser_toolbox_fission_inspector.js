




const { PromiseTestUtils } = ChromeUtils.import(
  "resource://testing-common/PromiseTestUtils.jsm"
);
PromiseTestUtils.whitelistRejectionsGlobally(/File closed/);


requestLongerTimeout(4);




add_task(async function() {
  const ToolboxTask = await initBrowserToolboxTask({
    enableBrowserToolboxFission: true,
  });
  await ToolboxTask.importFunctions({
    selectNodeFront,
  });

  const tab = await addTab(
    `data:text/html,<div id="my-div" style="color: red">Foo</div>`
  );

  
  tab.linkedBrowser.setAttribute("test-tab", "true");

  const color = await ToolboxTask.spawn(null, async () => {
    
    const inspector = await gToolbox.selectTool("inspector");
    const onSidebarSelect = inspector.sidebar.once("select");
    inspector.sidebar.select("computedview");
    await onSidebarSelect;

    const browser = await selectNodeFront(
      inspector,
      inspector.walker,
      'browser[remote="true"][test-tab]'
    );
    const browserTarget = await browser.connectToRemoteFrame();
    const walker = (await browserTarget.getFront("inspector")).walker;
    await selectNodeFront(inspector, walker, "#my-div");

    const view = inspector.getPanel("computedview").computedView;
    function getProperty(name) {
      const propertyViews = view.propertyViews;
      for (const propView of propertyViews) {
        if (propView.name == name) {
          return propView;
        }
      }
      return null;
    }
    const prop = getProperty("color");
    return prop.valueNode.textContent;
  });

  is(
    color,
    "rgb(255, 0, 0)",
    "The color property of the <div> within a tab isn't red"
  );

  await ToolboxTask.destroy();
});
