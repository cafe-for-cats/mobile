"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var TrackableSchema = new mongoose_1.Schema({
    schemaId: mongoose_1.Schema.Types.ObjectId,
    userId: mongoose_1.Schema.Types.ObjectId,
    createDate: Date,
    displayOnMap: Boolean
});
var PinSchema = new mongoose_1.Schema({
    schemaId: mongoose_1.Schema.Types.ObjectId,
    trackableSchema: TrackableSchema,
    imageUrl: String
});
exports.default = PinSchema;
