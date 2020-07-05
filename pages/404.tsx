import React from 'react';

import { NOT_FOUND } from '../src/utils/statusCodes';
import CustomError from './_error';

export default function NotFound() {
  return <CustomError statusCode={NOT_FOUND} hasGetInitialPropsRun={false} />;
}
