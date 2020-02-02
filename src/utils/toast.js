import React from 'react';
import { ToastCloseButton } from '../components';
import { toast as toastFn } from 'react-toastify';
import classnames from 'classnames';

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
