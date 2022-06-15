const mongoose = require('mongoose');
const validator = require('validator');

const articleSchema = new mongoose.Schema({
  keyword: {
    type: String,
    required: true,
  },
  title: {
    type: String, // the name is a string
    required: true, // every user has a name, so it's a required field
  },
  text: {
    type: String, // the name is a string
    required: true, // every user has a name, so it's a required field
  },
  date: {
    type: String, // the name is a string
    required: true, // every user has a name, so it's a required field
  },
  source: {
    type: String, // the name is a string
    required: true, // every user has a name, so it's a required field
  },
  link: {
    type: String,
    required: [true, 'url required'],
    validate: {
      validator: (v) => validator.isURL(v),
      message: 'Sorry. You have to enter a valid link',
    },
  },
  image: {
    type: String,
    required: [true, 'url required'],
    validate: {
      validator: (v) => validator.isURL(v),
      message: 'Sorry. You have to enter a valid link',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
    // select: false,
  },
});

// articleSchema.methods.toJSON = function () {
//   // eslint-disable-line
//   const { owner, ...obj } = this.toObject(); // eslint-disable-line
//   return obj;
// };

module.exports = mongoose.model('article', articleSchema);
