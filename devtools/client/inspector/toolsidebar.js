



"use strict";

const EventEmitter = require("resource://devtools/shared/event-emitter.js");

class ToolSidebar extends EventEmitter {
  constructor(tabbox, panel, options = {}) {
    super();

    this.#tabbox = tabbox;
    this.#panelDoc = this.#tabbox.ownerDocument;
    this.#toolPanel = panel;
    this.#options = options;

    if (!options.disableTelemetry) {
      this.#telemetry = this.#toolPanel.telemetry;
    }

    if (this.#options.hideTabstripe) {
      this.#tabbox.setAttribute("hidetabs", "true");
    }

    this.render();

    this.#toolPanel.emit("sidebar-created", this);
  }

  TABPANEL_ID_PREFIX = "sidebar-panel-";
  #currentTool;
  #destroyed;
  #options;
  #panelDoc;
  #tabbar;
  #tabbox;
  #telemetry;
  #toolNames;
  #toolPanel;

  

  get React() {
    return this.#toolPanel.React;
  }

  get ReactDOM() {
    return this.#toolPanel.ReactDOM;
  }

  get browserRequire() {
    return this.#toolPanel.browserRequire;
  }

  get InspectorTabPanel() {
    return this.#toolPanel.InspectorTabPanel;
  }

  get TabBar() {
    return this.#toolPanel.TabBar;
  }

  

  render() {
    const sidebar = this.TabBar({
      menuDocument: this.#toolPanel.toolbox.doc,
      showAllTabsMenu: true,
      allTabsMenuButtonTooltip: this.#options.allTabsMenuButtonTooltip,
      sidebarToggleButton: this.#options.sidebarToggleButton,
      onSelect: this.handleSelectionChange.bind(this),
    });

    this.#tabbar = this.ReactDOM.render(sidebar, this.#tabbox);
  }

  


  addAllQueuedTabs() {
    this.#tabbar.addAllQueuedTabs();
  }

  








  addTab(id, title, panel, selected, index) {
    this.#tabbar.addTab(id, title, selected, panel, null, index);
    this.emit("new-tab-registered", id);
  }

  








  addExistingTab(id, title, selected, index) {
    const panel = this.InspectorTabPanel({
      id,
      idPrefix: this.TABPANEL_ID_PREFIX,
      key: id,
      title,
    });

    this.addTab(id, title, panel, selected, index);
  }

  








  queueTab(id, title, panel, selected, index) {
    this.#tabbar.queueTab(id, title, selected, panel, null, index);
    this.emit("new-tab-registered", id);
  }

  








  queueExistingTab(id, title, selected, index) {
    const panel = this.InspectorTabPanel({
      id,
      idPrefix: this.TABPANEL_ID_PREFIX,
      key: id,
      title,
    });

    this.queueTab(id, title, panel, selected, index);
  }

  





  removeTab(tabId) {
    this.#tabbar.removeTab(tabId);

    this.emit("tab-unregistered", tabId);
  }

  




  toggleTab(isVisible, id) {
    this.#tabbar.toggleTab(id, isVisible);
  }

  


  select(id) {
    this.#tabbar.select(id);
  }

  


  getCurrentTabID() {
    return this.#currentTool;
  }

  




  getTabPanel(id) {
    
    
    return this.#panelDoc.querySelector(
      "#" + this.TABPANEL_ID_PREFIX + id + ", #" + id
    );
  }

  


  handleSelectionChange(id) {
    if (this.#destroyed) {
      return;
    }

    const previousTool = this.#currentTool;
    if (previousTool) {
      this.emit(previousTool + "-unselected");
    }

    this.#currentTool = id;

    this.updateTelemetryOnChange(id, previousTool);
    this.emit(this.#currentTool + "-selected");
    this.emit("select", this.#currentTool);
  }

  







  updateTelemetryOnChange(currentToolId, previousToolId) {
    if (currentToolId === previousToolId || !this.#telemetry) {
      
      return;
    }

    currentToolId = this.getTelemetryPanelNameOrOther(currentToolId);

    if (previousToolId) {
      previousToolId = this.getTelemetryPanelNameOrOther(previousToolId);
      this.#telemetry.toolClosed(previousToolId, this);

      this.#telemetry.recordEvent("sidepanel_changed", "inspector", null, {
        oldpanel: previousToolId,
        newpanel: currentToolId,
        os: this.#telemetry.osNameAndVersion,
      });
    }
    this.#telemetry.toolOpened(currentToolId, this);
  }

  








  getTelemetryPanelNameOrOther(id) {
    if (!this.#toolNames) {
      
      
      const ids = this.#tabbar.state.tabs.map(({ id: toolId }) => {
        return toolId.includes("-") ? "other" : toolId;
      });

      this.#toolNames = new Set(ids);
    }

    if (!this.#toolNames.has(id)) {
      return "other";
    }

    return id;
  }

  





  show(id) {
    this.#tabbox.hidden = false;

    
    if (id) {
      this.select(id);
    }

    this.emit("show");
  }

  


  hide() {
    this.#tabbox.hidden = true;

    this.emit("hide");
  }

  


  destroy() {
    if (this.#destroyed) {
      return;
    }
    this.#destroyed = true;

    this.emit("destroy");

    if (this.#currentTool && this.#telemetry) {
      this.#telemetry.toolClosed(this.#currentTool, this);
    }

    this.#toolPanel.emit("sidebar-destroyed", this);

    this.ReactDOM.unmountComponentAtNode(this.#tabbox);

    this.#tabbox = null;
    this.#telemetry = null;
    this.#panelDoc = null;
    this.#toolPanel = null;
  }
}

exports.ToolSidebar = ToolSidebar;
