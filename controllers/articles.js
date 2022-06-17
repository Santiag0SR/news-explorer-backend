const Article = require('../models/article');
const { OK, CREATED, NOT_FOUND } = require('../utils/apploication_constants');

const NotFoundError = require('../errors/not-found-err');
// const ForbiddenError = require('../errors/conflict-error');
const BadRequestError = require('../errors/bad-request-error');

const getArticles = (req, res, next) => {
  Article.find({})
    .then((articles) => res.status(OK).send(articles))
    .catch(next);
};

const saveArticle = (req, res, next) => {
  const { keyword, title, text, date, source, link, image } = req.body;
  const owner = req.user._id;
  Article.create({
    keyword,
    title,
    text,
    date,
    source,
    link,
    image,
    owner,
  })
    .then((articles) => res.status(CREATED).send({ data: articles }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(err.message));
      } else {
        next(err);
      }
    });
};

const deleteArticle = (req, res, next) => {
  const { articleId } = req.params;
  Article.findById(articleId)
    .orFail(() => new NotFoundError('Article id not found'))
    .then((article) => {
      if (article.owner.equals(req.user._id)) {
        Article.deleteOne(article).then((article) =>
          res.send({ data: article })
        );
      } else {
        throw new ForbiddenError('You cannot delete this article');
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Invalid article ID'));
      } else if (err.statusCode === NOT_FOUND) {
        next(new NotFoundError('Article not found'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getArticles,
  saveArticle,
  deleteArticle,
};
