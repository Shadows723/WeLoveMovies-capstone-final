const service = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function movieExists(request, response, next) {
  // TODO: Add your code here.
  let data = {};
  console.log("movie exists called");
  const { movieId } = request.params;
  try {
    data = await service.read(movieId);
  } catch (error) {
    console.log(error);
    next({ status: 404, message: `An error occurred: ${error}` });
  }
  if (typeof data != "undefined" && data != null) {
    response.locals.movie = data;
    next();
  } else {
    console.log(`No Data: ${data}`);
    next({
      status: 404,
      message: `no result for movie id: ${movieId}`,
    });
  }
}

async function read(request, response) {
  // TODO: Add your code here
  const data = response.locals.movie;
  if (!data) {
    response.json("data is empty");
  }
  console.log(data);
  response.json({ data });
}

async function list(request, response) {
  // TODO: Add your code here.
  let is_showing = request.query;
  if (!is_showing) {
    is_showing = false;
  }

  const data = await service.list(is_showing);
  response.json({ data });
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  read: [asyncErrorBoundary(movieExists), read],
};
