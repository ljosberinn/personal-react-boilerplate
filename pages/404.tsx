import { NOT_FOUND } from '../karma/utils/statusCodes';
import CustomError from './_error';

// eslint-disable-next-line import/no-default-export
export default function NotFound(): JSX.Element {
  return <CustomError statusCode={NOT_FOUND} hasGetInitialPropsRun={false} />;
}
