import { Delete } from 'rbx';
import React from 'react';

export default function ToastCloseButton({ closeToast }) {
  return <Delete onClick={closeToast} />;
}
