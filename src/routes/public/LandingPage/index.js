import React from 'react';
import { Title } from 'rbx';

export default function LandingPage() {
  return (
    <div id="hero" className="level-item">
      <div className="hero-content is-flex">
        <Title textWeight="bold">A very catchy slogan</Title>
        <p className="t22-t16">
          Yeah yeah, we get it. You do this, that and probably something else
          too.
        </p>
      </div>
      <div className="hero-image">here goes the image</div>
    </div>
  );
}
