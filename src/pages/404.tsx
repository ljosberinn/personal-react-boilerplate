import { NOT_FOUND } from '../utils/statusCodes';
import CustomError from './_error';

export default function NotFound(): JSX.Element {
  return <CustomError statusCode={NOT_FOUND} hasGetInitialPropsRun={false} />;
}
