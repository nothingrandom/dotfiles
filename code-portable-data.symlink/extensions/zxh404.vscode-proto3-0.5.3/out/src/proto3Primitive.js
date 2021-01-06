'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.Proto3Primitive = void 0;
var Proto3Primitive;
(function (Proto3Primitive) {
    Proto3Primitive.primitiveTypes = [
        'double',
        'float',
        'int32',
        'int64',
        'uint32',
        'uint64',
        'sint32',
        'sint64',
        'fixed32',
        'fixed64',
        'sfixed32',
        'sfixed64',
        'bool',
        'string'
    ];
    Proto3Primitive.isTypePrimitive = (type) => Proto3Primitive.primitiveTypes.indexOf(type) > -1;
})(Proto3Primitive = exports.Proto3Primitive || (exports.Proto3Primitive = {}));
//# sourceMappingURL=proto3Primitive.js.map