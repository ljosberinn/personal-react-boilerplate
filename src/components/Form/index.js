import PropTypes from 'prop-types';
import React from 'react';

/**
 *
 * @param {{
 * onSubmit: (e: React.FormEvent<HTMLFormElement>) => void,
 * spellCheck: boolean,
 * autoCorrect: 'on' | 'off',
 * children: JSX.Element
 * }} props
 */
export default function Form({
  onSubmit,
  spellCheck = false,
  autoCorrect = 'off',
  children,
}) {
  return (
    <form onSubmit={onSubmit} autoCorrect={autoCorrect} spellCheck={spellCheck}>
      {children}
    </form>
  );
}

Form.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  spellCheck: PropTypes.bool,
  autoCorrect: PropTypes.oneOf(['off', 'on']),
};
