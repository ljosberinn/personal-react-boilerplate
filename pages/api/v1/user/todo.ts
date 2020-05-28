import nextConnect from 'next-connect';

import { protectedResourceMiddleware } from '../../../../src/server/auth/middlewares';

export default nextConnect()
  .use(protectedResourceMiddleware)
  .get(async (_, res) => {
    try {
      const response = await fetch(
        'https://jsonplaceholder.typicode.com/todos/1'
      );
      const json = await response.json();

      res.json({ json });
    } catch (error) {
      console.error(error);

      res.json({
        completed: false,
        id: 1,
        title: 'Lorem ipsum dolor',
        userId: 1,
      });
    }
  });
