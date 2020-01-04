



"use strict";

const { createClass, DOM: dom } =
  require("devtools/client/shared/vendor/react");
const Services = require("Services");

const Strings = Services.strings.createBundle(
  "chrome://devtools/locale/aboutdebugging.properties");

const LocaleCompare = (a, b) => {
  return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
};

module.exports = createClass({
  displayName: "TargetList",

  render() {
    let { client, debugDisabled, targetClass, targets, sort } = this.props;
    if (sort) {
      targets = targets.sort(LocaleCompare);
    }
    targets = targets.map(target => {
      return targetClass({ client, target, debugDisabled });
    });

    return dom.div({ id: this.props.id, className: "targets" },
      dom.h2(null, this.props.name),
      targets.length > 0 ?
        dom.ul({ className: "target-list" }, targets) :
        dom.p(null, Strings.GetStringFromName("nothing"))
    );
  },
});
