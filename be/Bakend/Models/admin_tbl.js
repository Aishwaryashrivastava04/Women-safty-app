var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var admin = new Schema({
    name:String,
    phone:Number,
    email:String,
    password:String,
});

module.exports = mongoose.model("admin_tbl",admin);
