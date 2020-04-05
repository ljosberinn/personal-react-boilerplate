import { ReactNode } from 'react';
import { createPortal } from 'react-dom';

import { usePortal } from '../../hooks/usePortal';

interface Props {
  id: string;
  children: ReactNode;
}

export default function Portal({ id, children }: Props) {
  const target = usePortal(id);

  return createPortal(children, target);
}
