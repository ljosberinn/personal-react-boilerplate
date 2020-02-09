import classnames from 'classnames';
import { Delete } from 'rbx';
import React from 'react';
import { toast as toastFn } from 'react-toastify';

function ToastCloseButton({ closeToast }) {
  return <Delete onClick={closeToast} />;
}

toastFn.configure({
  autoClose: 20000,
  draggable: false,
  position: toastFn.POSITION.BOTTOM_RIGHT,
  closeButton: <ToastCloseButton />,
});

/**
 *
 * @param {{
 * content: import('react-toastify').ToastContent
 * type: 'primary' | 'success' | 'warning' | 'info' | 'danger';
 * } & import('react-toastify').CommonOptions} props
 */
export default function toast({ content, type = 'primary', ...rest }) {
  return toastFn(content, {
    className: classnames('notification', `is-${type}`),
    ...rest,
  });
}
