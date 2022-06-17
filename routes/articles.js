const router = require('express').Router();
const {
  getArticles,
  saveArticle,
  deleteArticle,
} = require('../controllers/articles');

const {
  validateIdArticle,
  validateSaveArticle,
} = require('../middlewares/validation');

router.get('/', getArticles);
router.post('/', validateSaveArticle, saveArticle);
router.delete('/:articleId', validateIdArticle, deleteArticle);

module.exports = router;
