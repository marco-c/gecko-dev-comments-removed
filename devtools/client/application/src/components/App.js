



"use strict";

const PropTypes = require("devtools/client/shared/vendor/react-prop-types");
const { createFactory, Component } = require("devtools/client/shared/vendor/react");
const { connect } = require("devtools/client/shared/vendor/react-redux");
const { div } = require("devtools/client/shared/vendor/react-dom-factories");

const WorkerList = createFactory(require("./WorkerList"));




class App extends Component {
  static get propTypes() {
    return {
      client: PropTypes.object.isRequired,
      workers: PropTypes.object.isRequired,
      serviceContainer: PropTypes.object.isRequired,
    };
  }

  render() {
    let { workers, client, serviceContainer } = this.props;

    return div({className: "application"},
      WorkerList({ workers, client, serviceContainer }));
  }
}



module.exports = connect(
  (state) => ({ workers: state.workers.list }),
)(App);
