"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const autodebugger_1 = require("./autodebugger");
let autodebugger = null;
exports.install = (config) => {
    autodebugger = new autodebugger_1.Autodebugger(config);
};
exports.trace = (...args) => {
    return autodebugger.trace(...args);
};
exports.trap = (...args) => {
    return autodebugger.trap(...args);
};
exports.invoke = (...args) => {
    return autodebugger.invoke(...args);
};
//# sourceMappingURL=index.js.map