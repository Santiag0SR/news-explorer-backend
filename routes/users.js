const router = require('express').Router();

const {
  getUsers,
  getUser,
  // getCurrentUser
} = require('../controllers/users');

const { validateIdUser } = require('../middlewares/validation');

router.get('/', getUsers);
// router.get('/me', getCurrentUser);
router.get('/:userId', validateIdUser, getUser);

module.exports = router;
