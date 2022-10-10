"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserNotConnectedError = exports.UserRejectedRequestError = exports.ConnectorNotFoundError = exports.ConnectorNotConnectedError = exports.ConnectorAlreadyConnectedError = void 0;
class ConnectorAlreadyConnectedError extends Error {
    constructor() {
        super(...arguments);
        this.name = 'ConnectorAlreadyConnectedError';
        this.message = 'Connector already connected';
    }
}
exports.ConnectorAlreadyConnectedError = ConnectorAlreadyConnectedError;
class ConnectorNotConnectedError extends Error {
    constructor() {
        super(...arguments);
        this.name = 'ConnectorNotConnectedError';
        this.message = 'Connector not connected';
    }
}
exports.ConnectorNotConnectedError = ConnectorNotConnectedError;
class ConnectorNotFoundError extends Error {
    constructor() {
        super(...arguments);
        this.name = 'ConnectorNotFoundError';
        this.message = 'Connector not found';
    }
}
exports.ConnectorNotFoundError = ConnectorNotFoundError;
class UserRejectedRequestError extends Error {
    constructor() {
        super(...arguments);
        this.name = 'UserRejectedRequestError';
        this.message = 'User rejected request';
    }
}
exports.UserRejectedRequestError = UserRejectedRequestError;
class UserNotConnectedError extends Error {
    constructor() {
        super(...arguments);
        this.name = 'UserNotConnectedError';
        this.message = 'User not connected';
    }
}
exports.UserNotConnectedError = UserNotConnectedError;
//# sourceMappingURL=errors.js.map