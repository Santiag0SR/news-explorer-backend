const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'email required'],
      unique: true,
      validate: {
        validator: (v) => validator.isEmail(v),
        message: 'This field must be an email.',
      },
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    name: {
      // every user has a name field, the requirements for which are described below:
      type: String, // the name is a string
      required: true, // every user has a name, so it's a required field
      minlength: 2, // the minimum length of the name is 2 characters
      maxlength: 30, // the maximum length is 30 characters
    },
  },
  { versionKey: false },
);

userSchema.statics.findUserByCredentials = function findUserByCredentials(
  email,
  password,
) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Incorrect email or password USUARIO'));
      }

      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(
            new Error('Incorrect email or password CONTRASENA'),
          );
        }

        return user; // now user is available
      });
    });
};

userSchema.methods.toJSON = function () { // eslint-disable-line
  const { password, ...obj } = this.toObject(); // eslint-disable-line
  return obj;
};

module.exports = mongoose.model('user', userSchema);
