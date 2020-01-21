import React from 'react';
import { Column } from 'rbx';
import LoginProviderButton from './LoginProviderButton';
import { ENABLED_PROVIDER } from '../constants/env';

/**
 * @returns {React.FC} LoginProviderGroup
 */
export default function LoginProviderGroup() {
  return (
    <Column.Group multiline>
      {ENABLED_PROVIDER.map(provider => (
        <Column key={provider} size="half">
          <LoginProviderButton provider={provider} />
        </Column>
      ))}
    </Column.Group>
  );
}
