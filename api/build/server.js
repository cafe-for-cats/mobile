"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var body_parser_1 = __importDefault(require("body-parser"));
var express_1 = __importDefault(require("express"));
var database_1 = __importDefault(require("./config/database"));
var pinRoutes_1 = __importDefault(require("./routes/pinRoutes"));
var cors_1 = __importDefault(require("cors"));
require('env2')('.env');
var app = express_1.default();
app.use(cors_1.default());
// Connect to MongoDB
database_1.default();
// Express configuration
app.set('port', process.env.PORT || 3000);
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: false }));
// @route   GET /
// @desc    Test Base API
// @access  Public
app.get('/', function (_req, res) {
    res.send('Hello, world!');
});
app.use('/pins', pinRoutes_1.default);
var port = app.get('port');
var server = app.listen(port, function () {
    return console.log("Server started on port " + port);
});
exports.default = server;
