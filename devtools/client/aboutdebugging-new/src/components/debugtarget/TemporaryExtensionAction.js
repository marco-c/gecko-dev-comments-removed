



"use strict";

const { createFactory, PureComponent } = require("devtools/client/shared/vendor/react");
const dom = require("devtools/client/shared/vendor/react-dom-factories");
const PropTypes = require("devtools/client/shared/vendor/react-prop-types");

const InspectAction = createFactory(require("./InspectAction"));

const Actions = require("../../actions/index");




class TemporaryExtensionAction extends PureComponent {
  static get propTypes() {
    return {
      dispatch: PropTypes.func.isRequired,
      target: PropTypes.object.isRequired,
    };
  }

  reload() {
    const { dispatch, target } = this.props;
    dispatch(Actions.reloadTemporaryExtension(target.details.actor));
  }

  remove() {
    const { dispatch, target } = this.props;
    dispatch(Actions.removeTemporaryExtension(target.id));
  }

  render() {
    const { dispatch, target } = this.props;

    return dom.div(
      {},
      InspectAction({ dispatch, target }),
      dom.button(
        {
          className: "aboutdebugging-button",
          onClick: e => this.reload()
        },
        "Reload",
      ),
      dom.button(
        {
          className: "aboutdebugging-button",
          onClick: e => this.remove()
        },
        "Remove",
      ),
    );
  }
}

module.exports = TemporaryExtensionAction;
