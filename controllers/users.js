const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => res.status(500).send({ massage: err.message }));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => {
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ massage: 'Переданы некорректные данные' });
      }
      return res.status(500).send({ massage: err.message });
    });
};

module.exports.getUserId = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user) {
        return res.status(200).send({ data: user });
      }
      return res.status(404).send({ massage: 'Пользователь с указанным id не найден.' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ massage: 'Переданы некорректные данные' });
      }
      return res.status(500).send({ massage: err.message });
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.params._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (user) {
        return res.status(200).send({ data: user });
      }
      return res.status(404).send({ massage: 'Пользователь с указанным id не найден.' });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return res.status(400).send({ massage: 'Переданы некорректные данные' });
      }
      return res.status(500).send({ massage: err.message });
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.params._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (user) {
        return res.status(200).send({ data: user });
      }
      return res.status(404).send({ massage: 'Пользователь с указанным id не найден.' });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return res.status(400).send({ massage: 'Переданы некорректные данные' });
      }
      return res.status(500).send({ massage: err.message });
    });
};
