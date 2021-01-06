"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var supertest_1 = __importDefault(require("supertest"));
var server_1 = __importDefault(require("../server"));
describe('main', function () {
    it('should always pass', function () {
        chai_1.expect(true).to.equal(true);
    });
    it('should has status code 200', function (done) {
        supertest_1.default(server_1.default)
            .get('/')
            .expect(200)
            .end(function (err, res) {
            if (err)
                done(err);
            done();
        });
    });
});
