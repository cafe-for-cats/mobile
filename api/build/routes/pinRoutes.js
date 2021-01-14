"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var http_status_codes_1 = __importDefault(require("http-status-codes"));
var pinModels_1 = __importDefault(require("../models/pinModels"));
var mongoose_1 = require("mongoose");
var check_1 = require("express-validator/check");
var cors = require('cors'); // TODO: Fix type
var allowedOrigins = [
    'capacitor://localhost',
    'ionic://localhost',
    'http://localhost',
    'http://localhost:8080',
    'http://localhost:8100',
    'http://localhost:4200'
];
var corsOptions = {
    origin: function (origin, callback) {
        if (allowedOrigins.includes(origin) || !origin) {
            callback(null, true);
        }
        else {
            callback(new Error('Origin not allowed by CORS'));
        }
    }
};
var router = express_1.Router();
/**
 * @route GET pins/
 * @desc  Gets all pins
 */
router.get('/', cors(corsOptions), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var profile, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, pinModels_1.default.find({})];
            case 1:
                profile = _a.sent();
                if (!profile)
                    return [2 /*return*/, res
                            .status(http_status_codes_1.default.NOT_FOUND)
                            .json({ msg: 'Profile not found' })];
                res.json(profile);
                return [3 /*break*/, 3];
            case 2:
                err_1 = _a.sent();
                console.error('GET pins', err_1.message);
                if (err_1.kind === 'ObjectId') {
                    return [2 /*return*/, res
                            .status(http_status_codes_1.default.BAD_REQUEST)
                            .json({ msg: 'Profile not found' })];
                }
                res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).send('Server Error');
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
/**
 * @route GET pins/:id
 * @desc  Get a pin by its id
 */
router.get('/:id', cors(corsOptions), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, profile, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = mongoose_1.Types.ObjectId(req.params.id);
                return [4 /*yield*/, pinModels_1.default.findById(id)];
            case 1:
                profile = _a.sent();
                if (!profile)
                    return [2 /*return*/, res
                            .status(http_status_codes_1.default.NOT_FOUND)
                            .json({ msg: 'Profile not found' })];
                res.json(profile);
                return [3 /*break*/, 3];
            case 2:
                e_1 = _a.sent();
                console.error(e_1.message);
                if (e_1.kind === 'ObjectId') {
                    return [2 /*return*/, res.status(http_status_codes_1.default.BAD_REQUEST).json({ msg: e_1.message })];
                }
                res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).send('Server Error');
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
/**
 * @route POST pins/
 * @desc Create a new pin
 */
router.post('/', [
    cors(corsOptions),
    check_1.check('label', "'label' is a required field.")
        .not()
        .isEmpty(),
    check_1.check('userId', "'userId' is a required field.")
        .not()
        .isEmpty(),
    check_1.check('lat', "'lat' is a required field.")
        .not()
        .isEmpty(),
    check_1.check('lng', "'lng' is a required field.")
        .not()
        .isEmpty()
], function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var errors, _a, label, userId, _b, showOnMap, _c, imageUrl, _d, lat, _e, lng, fields, newItem, e_2;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                errors = check_1.validationResult(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res
                            .status(http_status_codes_1.default.UNPROCESSABLE_ENTITY)
                            .json({ errors: errors.array() })];
                }
                _a = req.body, label = _a.label, userId = _a.userId, _b = _a.showOnMap, showOnMap = _b === void 0 ? false : _b, _c = _a.imageUrl, imageUrl = _c === void 0 ? null : _c, _d = _a.lat, lat = _d === void 0 ? 0.0 : _d, _e = _a.lng, lng = _e === void 0 ? 0.0 : _e;
                fields = {
                    label: label,
                    showOnMap: showOnMap,
                    imageUrl: imageUrl,
                    trackable: {
                        createDate: new Date(),
                        userId: userId
                    },
                    position: {
                        lat: lat,
                        lng: lng
                    }
                };
                _f.label = 1;
            case 1:
                _f.trys.push([1, 3, , 4]);
                newItem = new pinModels_1.default(fields);
                return [4 /*yield*/, newItem.save()];
            case 2:
                _f.sent();
                res.json(newItem);
                return [3 /*break*/, 4];
            case 3:
                e_2 = _f.sent();
                console.error(e_2.message);
                res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).send('Server Error');
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
/**
 * @route UPDATE pins/
 * @desc Updates each field based on it's provided value.
 */
router.patch('/:id', [
    check_1.check('label', "'label' is a required field.")
        .not()
        .isEmpty(),
    check_1.check('userId', "'userId' is a required field.")
        .not()
        .isEmpty(),
    check_1.check('lat', "'lat' is a required field.")
        .not()
        .isEmpty(),
    check_1.check('lng', "'lng' is a required field.")
        .not()
        .isEmpty()
], function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var e_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, pinModels_1.default.findOneAndUpdate({ _id: req.params.id }, {
                        $set: {
                            showOnMap: req.body.showOnMap,
                            label: req.body.label,
                            userId: req.body.userId,
                            position: {
                                lat: req.body.lat,
                                lng: req.body.lng
                            },
                            trackable: {
                                userId: req.body.userId,
                                createDate: req.body.createDate
                            }
                        }
                    })];
            case 1:
                _a.sent();
                res.send('Updated Successfully');
                return [3 /*break*/, 3];
            case 2:
                e_3 = _a.sent();
                console.error(e_3.message);
                res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).send('Server Error');
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
/**
 * @route DELETE pins/
 * @desc Deletes a pin by its given id
 */
router.delete('/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var e_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, pinModels_1.default.findOneAndRemove({ _id: req.params.id })];
            case 1:
                _a.sent();
                res.json('Removed Pin');
                return [3 /*break*/, 3];
            case 2:
                e_4 = _a.sent();
                console.error(e_4.message);
                res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).send('Server Error');
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
