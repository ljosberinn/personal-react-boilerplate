import classnames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import Icon from './Icon';

/**
 *
 * @see https://buefy.org/documentation/loading
 * @see https://github.com/buefy/buefy/blob/dev/src/components/loading/Loading.vue
 *
 * @param {{
 * isFullPage?: boolean,
 * icon?: import('react-icons').IconType,
 * }}
 */
export default function Loader({ icon, isFullPage = false }) {
  return (
    <div
      className={classnames(
        'loading-overlay',
        'is-active',
        isFullPage && 'is-full-page',
      )}
    >
      <div className="loading-background" />
      {icon ? (
        <Icon size="large" className="fa-3x fa-spin" svg={icon} />
      ) : (
        <div className="loading-icon" />
      )}
    </div>
  );
}

Loader.propTypes = {
  isFullPage: PropTypes.bool,
  icon: PropTypes.elementType,
};
