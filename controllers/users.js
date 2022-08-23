const User = require('../models/user');

const ERROR_NOT_FOUND = 404;
const ERROR_BAD_REQUESR = 400;
const ERROR_INTERNAL_SERVER = 500;

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => res.status(ERROR_INTERNAL_SERVER).send({ massage: err.message }));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => {
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_BAD_REQUESR).send({ massage: 'Переданы некорректные данные' });
      }
      return res.status(ERROR_INTERNAL_SERVER).send({ massage: err.message });
    });
};

module.exports.getUserId = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user) {
        return res.status(200).send({ data: user });
      }
      return res.status(ERROR_NOT_FOUND).send({ massage: 'Пользователь с указанным id не найден.' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(ERROR_BAD_REQUESR).send({ massage: 'Переданы некорректные данные' });
      }
      return res.status(ERROR_INTERNAL_SERVER).send({ massage: err.message });
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (user) {
        return res.status(200).send({ data: user });
      }
      return res.status(ERROR_NOT_FOUND).send({ massage: 'Пользователь с указанным id не найден.' });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return res.status(ERROR_BAD_REQUESR).send({ massage: 'Переданы некорректные данные' });
      }
      return res.status(ERROR_INTERNAL_SERVER).send({ massage: err.message });
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (user) {
        return res.status(200).send({ data: user });
      }
      return res.status(ERROR_NOT_FOUND).send({ massage: 'Пользователь с указанным id не найден.' });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return res.status(ERROR_BAD_REQUESR).send({ massage: 'Переданы некорректные данные' });
      }
      return res.status(ERROR_INTERNAL_SERVER).send({ massage: err.message });
    });
};
