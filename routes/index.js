const apiRouter = require('express').Router();

const userRoutes = require('./User');

function apiErrorHandler(err, req, res, next) { // eslint-disable-line
  if (err.name === 'ValidationError') {
    let errorObj = {};
    for (const error in err.errors) {
      errorObj[error] = err.errors[error].message;
    }
    res.status(422).send(errorObj);
    return;
  }
  return next(err);
}

apiRouter.use('/user', userRoutes);
apiRouter.use(apiErrorHandler);

module.exports = apiRouter;
