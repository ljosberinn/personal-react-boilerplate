import { Title } from 'rbx';
import React from 'react';

import { TemplatedHelmet } from '../../../components';
import { LandingPageSvg } from '../../../components/themedSvgs';
import './LandingPage.scss';

export default function LandingPage() {
  return (
    <>
      <TemplatedHelmet>
        <title>Home</title>
      </TemplatedHelmet>
      <div id="hero" className="level-item">
        <div className="hero-content is-flex">
          <Title textColor="primary" textWeight="bold">
            A very catchy slogan
          </Title>
          <p className="t22-t16">
            Yeah yeah, we get it. You do this, that and probably something else
            too.
          </p>
        </div>
        <div className="hero-image">
          <LandingPageSvg />
        </div>
      </div>
    </>
  );
}
