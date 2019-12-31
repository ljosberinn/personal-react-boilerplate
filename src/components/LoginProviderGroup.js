import React from 'react';
import { Column } from 'rbx';
import LoginProviderButton from './LoginProviderButton';
import provider from '../constants/provider';

/**
 * @returns {React.FC} LoginProviderGroup
 */
export default function LoginProviderGroup() {
  return (
    <Column.Group multiline>
      {provider.map(provider => (
        <Column key={provider} size="half">
          <LoginProviderButton provider={provider} />
        </Column>
      ))}
    </Column.Group>
  );
}
