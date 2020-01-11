
let group = new FinalizationGroup(x => 0);
group.register({}, 1, {});
let token = {};
oomTest(() => group.unregister(token));
