const mongoose = require('mongoose');

const bcrypt = require('bcryptjs');

const { isEmail, isURL } = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    required: false,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    required: false,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: (v) => isURL(v, { required_protocol: true }),
      message: "Поле 'avatar' не соответствует формату URL",
    },
  },
  password: {
    type: String,
    select: false,
    required: true,
    minlength: 8,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: (v) => isEmail(v),
      message: 'Неправильный формат почты',
    },

  },
});

userSchema.statics.findUserByCredentials = function loginUser(res, email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw res.send({ message: 'Указан некорректный Email или пароль.' });
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw res.send({ message: 'Указан некорректный Email или пароль.' });
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
