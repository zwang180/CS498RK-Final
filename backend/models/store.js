var mongoose = require('mongoose');
var schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');

var storeSchema = new schema({
    name: { type: String, required: [true, 'An Store Name is required!'] },
    owner: { type: String, required: [true, 'An Owner is required!'], unique: true },
    ownerName: { type: String, required: [true, 'An Owner is required!'] },
    introduction: { type: String },
    city: { type: String },
    contact: {
      address: { type: String },
      hour: { type: String },
      email: { type: String },
      phone: { type: String}
    },
    dateCreated: { type: Date, default: Date.now },
    views: { type: Number, default: 0}
});

// Custom unique validation message
storeSchema.plugin(uniqueValidator, { message: 'Error, expected {PATH} to be unique.' });

module.exports = mongoose.model('Store', storeSchema);
