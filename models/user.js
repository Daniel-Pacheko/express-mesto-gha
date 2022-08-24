const mongoose = require('mongoose');
const { isEmail, isURL } = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlenght: 2,
    maxlenght: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlenght: 2,
    maxlenght: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: (url) => isURL(url),
      message: 'Поле должно быть URL',
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (email) => isEmail(email),
      massages: 'Не верный формат Email',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

module.exports = mongoose.model('user', userSchema);
