const service = require("./reviews.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const methodNotAllowed = require("../errors/methodNotAllowed");

async function reviewExists(request, response, next) {
  // TODO: Write your code here
  const { reviewId } = request.params;
  let data = {};

  try {
    data = await service.read(reviewId);
  } catch (error) {
    console.log(error);
    return next({ status: 404, message: `An error occurred: ${error}` });
  }

  if (typeof data !== "undefined" && data !== null) {
    console.log(
      `return data: ${data} ${request.originalUrl} ${JSON.stringify(reviewId)} `,
    );
    response.locals.review = data;
  } else {
    console.log("Data: No data");
    return next({
      status: 404,
      message: `cannot be found: ${reviewId}`,
    });
  }

  next();
}

async function destroy(request, response) {
  // TODO: Write your code here
  const review = response.locals.review;
  console.log(
    `deleting review id: ${review.review_id} ${JSON.stringify(review)}`,
  );
  service.destroy(review.review_id);
  response.sendStatus(204);
}

async function list(request, response) {
  // TODO: Write your code here
  const data = await service.list(request.params.movieId);

  response.json({ data });
}

function hasMovieIdInPath(request, response, next) {
  if (request.params.movieId) {
    return next();
  }
  methodNotAllowed(request, response, next);
}

function noMovieIdInPath(request, response, next) {
  if (request.params.movieId) {
    return methodNotAllowed(request, response, next);
  }
  next();
}

async function update(request, response) {
  // TODO: Write your code here
  const update = request.body.data;
  const updatedReview = {
    ...update,
    review_id: response.locals.review.review_id,
  };

  console.log(`updatedReview: ${JSON.stringify(update)}`);

   const result = await service.update(updatedReview);

  response.json({ data: result });
}

module.exports = {
  destroy: [
    noMovieIdInPath,
    asyncErrorBoundary(reviewExists),
    asyncErrorBoundary(destroy),
  ],
  list: [hasMovieIdInPath, asyncErrorBoundary(list)],
  update: [
    noMovieIdInPath,
    asyncErrorBoundary(reviewExists),
    asyncErrorBoundary(update),
  ],
};
