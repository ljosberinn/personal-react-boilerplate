import { Provider } from '../../../client/context/AuthContext/AuthContext';
import { isGithubProfile } from './github/validator';
import { isGoogleProfile } from './google/validator';

type ValidatorMap = {
  [key in Provider]: typeof isGithubProfile | typeof isGoogleProfile;
};

export default {
  github: isGithubProfile,
  google: isGoogleProfile,
} as ValidatorMap;
