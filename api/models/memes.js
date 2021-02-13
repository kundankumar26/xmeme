const mongoose = require('mongoose');

const memeSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true, immutable: true},
    caption: { type: String, required: true},
    url: {type: String, required: true},
    createdOn: {type: Date}
});

module.exports = mongoose.model('Meme', memeSchema);