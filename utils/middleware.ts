export {};
const logger = require("./logger");

interface IResult {
    next:any,
    previous:any,
    results: any
}

const requestLogger = (request, response, next) => {
  logger.info("Method:", request.method);
  logger.info("Path:  ", request.path);
  logger.info("Body:  ", request.body);
  logger.info("---");
  next();
};

const unknownRequest = (req, res) => {
  res.status(404).send({ error: "Unknow endpoint" });
};

const paginatedResults = (model, websiteName:string) => {
  return async (req, res, next) => {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const results: IResult = {
        next:'',
        previous:'',
        results: ''
    };

    if (endIndex < (await model.countDocuments().exec())) {
      results.next = {
        page: page + 1,
        limit: limit,
      };
    }

    if (startIndex > 0) {
      results.previous = {
        page: page - 1,
        limit: limit,
      };
    }

    try {
      results.results = await model
        .find({ website: websiteName })
        .sort({ $natural: -1 })
        .limit(limit)
        .skip(startIndex)
        .exec();
      res.paginatedResults = results;
      next();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
};

module.exports = {
  requestLogger,
  unknownRequest,
  paginatedResults,
};
