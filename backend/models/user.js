var mongoose = require('mongoose');
var schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');
var passportLocalMongoose = require('passport-local-mongoose');

var userSchema = new schema({
  email: { type: String, default: 'N/A' },
  username: { type: String, required: [true, 'An username is required!'], unique: true },
  password: { type: String, required: [true, 'A password is required!'] },
  nickname: { type: String, default: 'Anonymous'},
  ownerof: { type: String, default: '' },
  favorite: { type: [String] },
  dateCreated: { type: Date, default: Date.now }
});

// Custom unique validation message
userSchema.plugin(uniqueValidator, { message: 'Error, expected {PATH} to be unique.' });
// Use passport-local-mongoose to take care of everything
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);
