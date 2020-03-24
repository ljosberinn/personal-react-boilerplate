import { useHistory } from 'react-router-dom';

export default function useNavigate() {
  return useHistory().push;
}
