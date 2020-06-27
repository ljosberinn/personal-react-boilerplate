import { BAD_REQUEST } from '../../utils/statusCodes';
import { Middleware } from '../types';

/**
 * Middleware accepting exclusively valid JSON as req.body, if existing
 */
const expectJSONBodyMiddleware: Middleware = (req, res, next) => {
  if (req.body.length > 0) {
    try {
      req.body = JSON.parse(req.body);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      return res.status(BAD_REQUEST).end();
    }
  }

  next();
};

export default expectJSONBodyMiddleware;
