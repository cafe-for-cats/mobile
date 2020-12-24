"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = __importDefault(require("config"));
var http_status_codes_1 = __importDefault(require("http-status-codes"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function default_1(req, res, next) {
    // Get token from header
    var token = req.header('x-auth-token');
    // Check if no token
    if (!token) {
        return res
            .status(http_status_codes_1.default.UNAUTHORIZED)
            .json({ msg: 'No token, authorization denied' });
    }
    // Verify token
    try {
        var payload = jsonwebtoken_1.default.verify(token, config_1.default.get('jwtSecret'));
        req.userId = payload.userId;
        next();
    }
    catch (err) {
        res
            .status(http_status_codes_1.default.UNAUTHORIZED)
            .json({ msg: 'Token is not valid' });
    }
}
exports.default = default_1;
