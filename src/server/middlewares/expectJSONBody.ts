import { BAD_REQUEST } from '../../utils/statusCodes';
import type { Middleware } from '../types';

/**
 * Middleware accepting exclusively valid JSON as req.body, if existing
 */
export const expectJSONBodyMiddleware: Middleware = (req, res, next) => {
  if (req.body.length > 0) {
    try {
      const body = JSON.parse(req.body);

      if (!(body instanceof Object)) {
        res.status(BAD_REQUEST).end();
        return;
      }

      req.body = body;
    } catch (error: unknown) {
      // eslint-disable-next-line no-console
      console.error(error);

      res.status(BAD_REQUEST).end();
      return;
    }
  }

  next();
};
