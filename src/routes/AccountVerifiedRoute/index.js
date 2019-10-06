import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ConfirmationSvg, ErrorSvg, LoadingSvg } from '../../assets/svg';

function AccountVerifiedRoute() {
  const { token } = useParams();
  const [tokenVerfied, setTokenVerified] = useState(false);

  useEffect(() => {}, []);

  return <h1>hi</h1>;
}

export default AccountVerifiedRoute;
