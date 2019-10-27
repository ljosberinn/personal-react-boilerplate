import React from 'react';
import { Button, Icon } from 'rbx';
import styles from './GoogleSignInButton.module.scss';
import { ReactComponent as GoogleSvg } from '../assets/svg/GoogleLogo.svg';

export default function GoogleSignInButton({ onClick }) {
  return (
    <Button type="button" onClick={onClick} fullwidth className={styles.button}>
      <Icon>
        <GoogleSvg />
      </Icon>
      <span>Sign in with Google</span>
    </Button>
  );
}
