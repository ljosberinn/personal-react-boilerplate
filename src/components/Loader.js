import React from 'react';
import { sanitizeClassArray } from '../utils';
import { Icon } from '.';
// eslint-disable-next-line
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';

/**
 * @see https://buefy.org/documentation/loading
 * @see https://github.com/buefy/buefy/blob/dev/src/components/loading/Loading.vue
 *
 * @param {{
 *  icon: IconDefinition,
 *  isFullPage: boolean
 * }} props
 */
function Loader({ icon = undefined, isFullPage = false }) {
  return (
    <div
      className={sanitizeClassArray([
        'loading-overlay',
        'is-active',
        isFullPage && 'is-full-page',
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

export default Loader;
