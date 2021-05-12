const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const historySchema = new Schema({
  title: { type: String, required: true },
  artist: { type: String, required: true },
  albumCover: { type: String, required: true }
}, {
  timestamps: true,
});

const History = mongoose.model('History', historySchema);

module.exports = History;