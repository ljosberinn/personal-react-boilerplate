import { useHistory } from 'react-router-dom';

/**
 * @returns {ReturnType<useHistory>['push']}
 */
export default function useNavigate() {
  return useHistory().push;
}
