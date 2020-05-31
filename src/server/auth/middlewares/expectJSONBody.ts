import { Middleware } from 'next-connect';

import { BAD_REQUEST } from '../../../utils/statusCodes';

/**
 * Middleware accepting exclusively valid JSON as req.body, if existing
 */
const expectJSONBodyMiddleware: Middleware = (req, res, next) => {
  if (req.body.length > 0) {
    try {
      req.body = JSON.parse(req.body);
    } catch (error) {
      console.error(error);
      return res.status(BAD_REQUEST).end();
    }
  }

  next();
};

export default expectJSONBodyMiddleware;
