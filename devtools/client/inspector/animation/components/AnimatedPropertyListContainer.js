



"use strict";

const { createFactory, PureComponent } = require("devtools/client/shared/vendor/react");
const dom = require("devtools/client/shared/vendor/react-dom-factories");
const PropTypes = require("devtools/client/shared/vendor/react-prop-types");

const AnimatedPropertyList = createFactory(require("./AnimatedPropertyList"));
const AnimatedPropertyListHeader = createFactory(require("./AnimatedPropertyListHeader"));

class AnimatedPropertyListContainer extends PureComponent {
  static get propTypes() {
    return {
      animation: PropTypes.object.isRequired,
      getAnimatedPropertyMap: PropTypes.func.isRequired,
    };
  }

  render() {
    const {
      animation,
      getAnimatedPropertyMap,
    } = this.props;

    return dom.div(
      {
        className: "animated-property-list-container"
      },
      AnimatedPropertyListHeader(),
      AnimatedPropertyList(
        {
          animation,
          getAnimatedPropertyMap,
        }
      )
    );
  }
}

module.exports = AnimatedPropertyListContainer;
