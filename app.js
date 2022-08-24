const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { celebrate, Joi, errors } = require('celebrate');
const routerUser = require('./routes/users');
const routerCard = require('./routes/cards');
const auth = require('./middlewares/auth');
const errorMy = require('./middlewares/errors');
const { createUser, login } = require('./controllers/users');

const NotFoundError = require('./errors/NotFoundError');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(/^(https?:\/\/)?([\da-z.-]+).([a-z.]{2,6})([/\w.-]*)*\/?$/),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

app.use(auth);
app.use('/', routerUser);
app.use('/', routerCard);
app.use('*', () => {
  throw new NotFoundError('Не существующий адрес.');
});

app.use(errors());
app.use(errorMy);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
