"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const autodebugger_1 = require("./autodebugger");
let autodebugger = null;
exports.install = (config) => {
    autodebugger = new autodebugger_1.Autodebugger(config);
};
exports.trace = (...args) => {
    autodebugger.trace(...args);
};
exports.trap = (...args) => {
    autodebugger.trap(...args);
};
//# sourceMappingURL=index.js.map