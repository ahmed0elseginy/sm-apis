const validate = (schema) => (req, res, next) => {
  try {
    const payload = {
      body: req.body || {},
      params: req.params || {},
      query: req.query || {},
    };
    const data = schema.parse(payload);
    if (data.body !== undefined) req.validBody = data.body;
    if (data.params !== undefined) req.validParams = data.params;
    if (data.query !== undefined) req.validQuery = data.query;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = validate;
