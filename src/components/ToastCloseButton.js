import React from 'react';
import { Delete } from 'rbx';

export default function ToastCloseButton({ closeToast }) {
  return <Delete onClick={closeToast} />;
}
