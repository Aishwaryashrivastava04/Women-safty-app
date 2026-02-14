var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var newSchema = new Schema({
    title: String,
    description: String,
    PostedOn: {
        type: Date,
        default: Date.now,
    },
    createdBy: {
        type: Schema.Types.ObjectId,
    },
    comments: [
        {
            comment: String,
            commentedBy: {
                type: mongoose.Schema.Types.ObjectId
            },
            PostedOn: {
                type: Date,
                default: Date.now,
            },
        }
    ]
});

module.exports = mongoose.model("Story", newSchema);