"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PinController = void 0;
var mongoose = __importStar(require("mongoose"));
var pinsSchema_1 = __importDefault(require("../models/pinsSchema"));
var Contact = mongoose.model('Contact', pinsSchema_1.default);
var PinController = /** @class */ (function () {
    function PinController() {
    }
    PinController.prototype.addNewContact = function (req, res) {
        var newContact = new Contact(req.body);
        newContact.save(function (err, contact) {
            if (err) {
                res.send(err);
            }
            res.json(contact);
        });
    };
    return PinController;
}());
exports.PinController = PinController;
