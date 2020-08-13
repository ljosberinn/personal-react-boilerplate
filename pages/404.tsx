import { NOT_FOUND } from '../src/utils/statusCodes';
import CustomError from './_error';

// eslint-disable-next-line import/no-default-export
export default function NotFound() {
  return <CustomError statusCode={NOT_FOUND} hasGetInitialPropsRun={false} />;
}
