"use strict";
// Copied from https://github.com/Microsoft/vscode-eslint/blob/ad394e3eabfa89c78c38904d71d9aebf64b7edfa/server/src/server.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_languageserver_1 = require("vscode-languageserver");
var Request;
(function (Request) {
    function is(value) {
        const candidate = value;
        return candidate && !!candidate.token && !!candidate.resolve && !!candidate.reject;
    }
    Request.is = is;
})(Request || (Request = {}));
var Thenable;
(function (Thenable) {
    function is(value) {
        const candidate = value;
        return candidate && typeof candidate.then === 'function';
    }
    Thenable.is = is;
})(Thenable || (Thenable = {}));
class BufferedMessageQueue {
    constructor(connection) {
        this.connection = connection;
        this.queue = [];
        this.requestHandlers = new Map();
        this.notificationHandlers = new Map();
    }
    registerRequest(type, handler, versionProvider) {
        this.connection.onRequest(type, (params, token) => __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this.queue.push({
                    method: type.method,
                    params,
                    documentVersion: versionProvider ? versionProvider(params) : undefined,
                    resolve,
                    reject,
                    token
                });
                this.trigger();
            });
        }));
        this.requestHandlers.set(type.method, { handler, versionProvider });
    }
    registerNotification(type, handler, versionProvider) {
        this.connection.onNotification(type, params => {
            this.queue.push({
                method: type.method,
                params,
                documentVersion: versionProvider ? versionProvider(params) : undefined,
            });
            this.trigger();
        });
        this.notificationHandlers.set(type.method, { handler, versionProvider });
    }
    addNotificationMessage(type, params, version) {
        this.queue.push({
            method: type.method,
            params,
            documentVersion: version
        });
        this.trigger();
    }
    onNotification(type, handler, versionProvider) {
        this.notificationHandlers.set(type.method, { handler, versionProvider });
    }
    trigger() {
        if (this.timer || this.queue.length === 0) {
            return;
        }
        this.timer = setImmediate(() => {
            this.timer = undefined;
            this.processQueue();
        });
    }
    processQueue() {
        const message = this.queue.shift();
        if (!message) {
            return;
        }
        if (Request.is(message)) {
            const requestMessage = message;
            if (requestMessage.token.isCancellationRequested) {
                requestMessage.reject(new vscode_languageserver_1.ResponseError(vscode_languageserver_1.ErrorCodes.RequestCancelled, 'Request got cancelled'));
                return;
            }
            const elem = this.requestHandlers.get(requestMessage.method);
            if (elem.versionProvider && requestMessage.documentVersion !== void 0 && requestMessage.documentVersion !== elem.versionProvider(requestMessage.params)) {
                requestMessage.reject(new vscode_languageserver_1.ResponseError(vscode_languageserver_1.ErrorCodes.RequestCancelled, 'Request got cancelled'));
                return;
            }
            const result = elem.handler(requestMessage.params, requestMessage.token);
            if (Thenable.is(result)) {
                result.then(value => {
                    requestMessage.resolve(value);
                }, error => {
                    requestMessage.reject(error);
                });
            }
            else {
                requestMessage.resolve(result);
            }
        }
        else {
            const notificationMessage = message;
            const elem = this.notificationHandlers.get(notificationMessage.method);
            if (elem.versionProvider && notificationMessage.documentVersion !== void 0 && notificationMessage.documentVersion !== elem.versionProvider(notificationMessage.params)) {
                return;
            }
            elem.handler(notificationMessage.params);
        }
        this.trigger();
    }
}
exports.default = BufferedMessageQueue;
//# sourceMappingURL=buffered-message-queue.js.map