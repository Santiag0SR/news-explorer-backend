const router = require('express').Router();
const userRouter = require('./users');
const articlesRouter = require('./articles');
const auth = require('../middlewares/auth');
const { createUser, login } = require('../controllers/users');
const NotFoundError = require('../errors/not-found-err');

const {
  validateCreateUser,
  validateLogin,
} = require('../middlewares/validation');

router.post('/signin', validateLogin, login);
router.post('/signup', validateCreateUser, createUser);

router.use(auth);

router.use('/users', userRouter);
router.use('/articles', articlesRouter);

router.use((req, res, next) => {
  next(new NotFoundError('Requested resource not found'));
});

module.exports = router;
