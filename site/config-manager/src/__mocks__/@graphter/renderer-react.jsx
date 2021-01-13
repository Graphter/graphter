"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pathConfigStore = exports.createDefault = exports.nodeRendererStore = exports.useNodeValidation = exports.useNodeData = exports.useArrayNodeData = void 0;
var react_1 = require("react");
exports.useArrayNodeData = jest.fn(function () {
    return {
        childIds: [],
        removeItem: jest.fn(),
        commitItem: jest.fn()
    };
});
exports.useNodeData = jest.fn(function () {
    return [
        null,
        function () { }
    ];
});
exports.useNodeValidation = jest.fn().mockResolvedValue([]);
exports.nodeRendererStore = {
    get: jest.fn(function (nodeType) { return ({
        type: 'string',
        renderer: function (_a) {
            var originalNodeData = _a.originalNodeData;
            var _b = react_1.useState(originalNodeData || ''), value = _b[0], setValue = _b[1];
            return (<input value={value} onChange={function (e) { return setValue(e.target.value); }} data-testid='string-renderer'/>);
        }
    }); })
};
exports.createDefault = jest.fn();
exports.pathConfigStore = {
    get: jest.fn(),
    set: jest.fn()
};
