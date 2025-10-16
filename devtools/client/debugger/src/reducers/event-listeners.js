



import { prefs } from "../utils/prefs";

export function initialEventListenerState() {
  return {
    
    categories: [],

    byPanel: {
      breakpoint: {
        active: [],
        expanded: [],
      },
      tracer: {
        
        expanded: [],
      },
    },

    logEventBreakpoints: prefs.logEventBreakpoints,

    
    
    
    active: [],
    expanded: [],
  };
}

function update(state = initialEventListenerState(), action) {
  switch (action.type) {
    case "RECEIVE_EVENT_LISTENER_TYPES": {
      
      
      
      
      
      const supportedEventIds = action.categories
        .map(category => category.events)
        .flat()
        .map(event => event.id);

      state.byPanel.breakpoint.active = state.active.filter(id =>
        supportedEventIds.includes(id)
      );

      return {
        ...state,
        categories: action.categories,
      };
    }

    case "UPDATE_EVENT_LISTENERS":
      if (action.panelKey == "tracer") {
        return state;
      }
      state.byPanel[action.panelKey].active = action.active;
      return { ...state };

    case "UPDATE_EVENT_LISTENER_EXPANDED":
      state.byPanel[action.panelKey].expanded = action.expanded;
      return { ...state };

    case "TOGGLE_EVENT_LISTENERS": {
      const { logEventBreakpoints } = action;
      prefs.logEventBreakpoints = logEventBreakpoints;
      return { ...state, logEventBreakpoints };
    }

    default:
      return state;
  }
}

export default update;
