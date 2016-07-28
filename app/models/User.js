var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var UserSchema   = new Schema({
    name:       { type: String, required: true },
    email:      { type: String, required: true, unique: true  },
    password: 	{ type: String, required: true },
    created:    { type: Date, default: Date.now },
    updated:    { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', UserSchema);