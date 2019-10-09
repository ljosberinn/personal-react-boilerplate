import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ConfirmationSvg, ErrorSvg, LoadingSvg } from '../../../assets/svg';
import { Column, Title, Image } from 'rbx';
import { Link } from 'react-router-dom';
import { Fade } from 'react-reveal';

const headings = {
  pending: 'Activating your account...',
  successful: 'Account activated!',
  rejected: 'Activation failure',
};

const icons = {
  pending: <LoadingSvg />,
  successful: <ConfirmationSvg />,
  rejected: <ErrorSvg />,
};

const messages = {
  pending: mail => null,
  rejected: mail =>
    'This link has been rejected. Either it is invalid or the window of registration expired.',
  successful: mail => (
    <span>
      Your account has been successfully activate. You may now{' '}
      <Link to={['/login', mail].filter(Boolean).join('/')}>login</Link>!
    </span>
  ),
};

function AccountActivationRoute() {
  const { token } = useParams();
  const [verification, setVerification] = useState('pending');
  const [mail, setMail] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      setVerification(
        Math.floor(Math.random() * 10) >= 5 ? 'rejected' : 'successful',
      );

      setMail('some@mail.com');
    }, 1500);
  }, [token]);

  return (
    <div className="has-content-spaced-evenly">
      <Title textAlign="centered">{headings[verification]}</Title>
      <Fade>
        <Image.Container size="16by9">{icons[verification]}</Image.Container>
      </Fade>
      <Column.Group centered>
        <Column size={10}>{messages[verification](mail)}</Column>
      </Column.Group>
    </div>
  );
}

export default AccountActivationRoute;
