const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');
const NotFoundError = require('../errors/NotFoundError');
const AuthError = require('../errors/AuthError');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

module.exports.createUser = ((req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        name, about, avatar, email, password: hash,
      })
        .then((user) => res.status(201).send({
          data: {
            name: user.name,
            about: user.about,
            avatar: user.avatar,
            email: user.email,
          },
        }))
        .catch((err) => {
          if (err.name === 'ValidationError' || err.name === 'CastError') {
            throw new BadRequestError('Переданы некорректные данные для создания пользователя');
          } else {
            next(err);
          }
          if (err.name === 'MongoServerError' && err.code === 11000) {
            throw new ConflictError('Пользователь с указанным email уже существует');
          } else {
            next(err);
          }
        });
    });
});

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new AuthError('Неправльные почта или пароль');
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new AuthError('Неправльные почта или пароль');
          }
          const token = jwt.sign({ _id: user._id }, 'secret-key', { expiresIn: '7d' });

          res.cookie('jwt', token, { maxAge: 3600000, httpOnly: true }).send({ data: token });
        })
        .catch(next);
    })
    .catch(next);
};

module.exports.getUserMe = (req, res, next) => {
  const myUserId = req.user._id;

  User.findById(myUserId)
    .then((user) => {
      if (user) {
        return res.send({ data: user });
      }
      throw new NotFoundError('Пользователь с указанным id не найден');
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports.getUserId = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user) {
        return res.status(200).send({ data: user });
      }
      throw new NotFoundError('Пользователь с указанным id не найден.');
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (user) {
        return res.status(200).send({ data: user });
      }
      throw new NotFoundError('Пользователь с указанным id не найден.');
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (user) {
        return res.status(200).send({ data: user });
      }
      throw new NotFoundError('Пользователь с указанным id не найден.');
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};
