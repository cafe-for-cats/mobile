"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var http_status_codes_1 = __importDefault(require("http-status-codes"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function default_1(req, res, next) {
    // Get token from header
    var token = req.headers['authorization'] || '';
    // Check if no token
    if (!token) {
        return res
            .status(http_status_codes_1.default.UNAUTHORIZED)
            .json({ msg: 'No token, authorization denied' });
    }
    var split = token.split(' ')[1];
    // Verify token
    try {
        jsonwebtoken_1.default.verify(split, process.env.ACCESS_TOKEN_SECRET, function (err, user) {
            if (err)
                return res.sendStatus(403);
        });
        next();
    }
    catch (err) {
        res.status(http_status_codes_1.default.UNAUTHORIZED).json({ msg: err.message });
    }
}
exports.default = default_1;
