import React from 'react';
import Icon from './Icon';
import classnames from 'classnames';

/**
 *
 * @see https://buefy.org/documentation/loading
 * @see https://github.com/buefy/buefy/blob/dev/src/components/loading/Loading.vue
 *
 * @returns {React.FC<{
 * isFullPage: boolean,
 * icon?: import('@fortawesome/free-solid-svg-icons').IconDefinition,
 * color?: 'light' | 'dark'
 * }>} Loader
 */
export default function Loader({ icon, isFullPage = false, color }) {
  return (
    <div
      className={classnames([
        'loading-overlay',
        'is-active',
        isFullPage && 'is-full-page',
        color && `to-${color}`,
      ])}
    >
      <div className="loading-background" />
      {icon ? (
        <Icon size="large" className="fa-3x fa-spin" icon={icon} />
      ) : (
        <div className="loading-icon" />
      )}
    </div>
  );
}
