import React from 'react';

import CustomError from './_error';

export default function NotFound() {
  return <CustomError statusCode={404} hasGetInitialPropsRun={false} />;
}
