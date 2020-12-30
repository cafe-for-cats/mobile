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
var express_1 = __importDefault(require("express"));
var bodyParser = __importStar(require("body-parser"));
var mongoose = __importStar(require("mongoose"));
var pinRoutes_1 = require("./routes/pinRoutes");
var App = /** @class */ (function () {
    function App() {
        this.user = 'user';
        this.password = 'd01YCo6Ua1rkqt56';
        this.app = express_1.default();
        this.routePrv = new pinRoutes_1.Routes();
        this.mongoUrl = "mongodb+srv://" + this.user + ":" + this.password + "@cluster0.tyrfy.mongodb.net/<dbname>?retryWrites=true&w=majority";
        this.config();
        this.mongoSetup();
        this.routePrv.routes(this.app);
    }
    App.prototype.config = function () {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
        // serving static files
        this.app.use(express_1.default.static('public'));
    };
    App.prototype.mongoSetup = function () {
        mongoose.Promise = global.Promise;
        mongoose.connect(this.mongoUrl, { useNewUrlParser: true });
    };
    return App;
}());
exports.default = new App().app;
