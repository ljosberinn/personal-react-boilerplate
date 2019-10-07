import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ConfirmationSvg, ErrorSvg, LoadingSvg } from '../../assets/svg';
import { Column, Title, Section, Image } from 'rbx';
import { Link } from 'react-router-dom';
import Fade from 'react-reveal/Fade';

function AccountActivationRoute() {
  const { token } = useParams();
  const [verification, setVerification] = useState('pending');
  const [mail, setMail] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      console.log(token);
      setVerification(
        Math.floor(Math.random() * 10) >= 5 ? 'rejected' : 'successful',
      );

      setMail('some@mail.com');
    }, 1500);
  }, [token]);

  const data = {
    heading: {
      pending: 'Activating your account...',
      successful: 'Account activated!',
      rejected: 'Activation failure',
    },
    icon: {
      pending: <LoadingSvg />,
      successful: <ConfirmationSvg />,
      rejected: <ErrorSvg />,
    },
    message: {
      pending: null,
      rejected:
        'This link has been rejected. Either it is invalid or the window of registration expired.',
      successful: (
        <span>
          Your account has been successfully activate. You may now{' '}
          <Link to={`/login/${mail}`}>login</Link>!
        </span>
      ),
    },
  };

  return (
    <Column className="has-content-vspaced has-padding-large has-background-white fade-in">
      <Title textAlign="centered">{data.heading[verification]}</Title>
      <Fade>
        <Image.Container size="16by9">
          {data.icon[verification]}
        </Image.Container>
      </Fade>
      <Column.Group centered>
        <Column size={10}>
          <Section paddingless>{data.message[verification]}</Section>
        </Column>
      </Column.Group>
      <div />
    </Column>
  );
}

export default AccountActivationRoute;
