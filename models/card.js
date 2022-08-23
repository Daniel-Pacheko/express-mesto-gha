const mongoose = require('mongoose');
const isURL = require('validator');

// создаем Карточку
const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
    minlenght: 2,
    maxlenght: 30,
  },
  link: {
    type: String,
    require: true,
    validate: {
      validator: (url) => isURL(url),
      message: 'Поле должно быть URL',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    require: true,
  },
  likes: {
    type: [mongoose.Types.ObjectId],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);
