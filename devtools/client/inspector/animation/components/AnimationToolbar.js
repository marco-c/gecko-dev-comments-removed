



"use strict";

const { createFactory, PureComponent } = require("devtools/client/shared/vendor/react");
const dom = require("devtools/client/shared/vendor/react-dom-factories");
const PropTypes = require("devtools/client/shared/vendor/react-prop-types");

const PauseResumeButton = createFactory(require("./PauseResumeButton"));
const RewindButton = createFactory(require("./RewindButton"));

class AnimationToolbar extends PureComponent {
  static get propTypes() {
    return {
      animations: PropTypes.arrayOf(PropTypes.object).isRequired,
      rewindAnimationsCurrentTime: PropTypes.func.isRequired,
      setAnimationsPlayState: PropTypes.func.isRequired,
    };
  }

  render() {
    const {
      animations,
      rewindAnimationsCurrentTime,
      setAnimationsPlayState,
    } = this.props;

    return dom.div(
      {
        className: "animation-toolbar devtools-toolbar",
      },
      RewindButton(
        {
          rewindAnimationsCurrentTime,
        }
      ),
      PauseResumeButton(
        {
          animations,
          setAnimationsPlayState,
        }
      )
    );
  }
}

module.exports = AnimationToolbar;
