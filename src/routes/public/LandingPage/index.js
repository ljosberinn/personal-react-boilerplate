import { Title, Section, Hero, Container, Column, Image } from 'rbx';
import React from 'react';

import { TemplatedHelmet } from '../../../components';
import { LandingPageSvg } from '../../../components/themedSvgs';
import { withSentry } from '../../../hocs';
import './LandingPage.scss';

export default withSentry(function LandingPage() {
  return (
    <>
      <TemplatedHelmet>
        <title>Home</title>
      </TemplatedHelmet>
      <Hero as={Section} relative className="is-medium is-block">
        <Container>
          <Column.Group vcentered className="is-desktop">
            <Column desktop={{ size: 5 }} className="has-text-centered-touch">
              <header>
                <Title
                  textWeight="bold"
                  className="is-1 is-size-2-mobile"
                  spaced
                  textColor="primary"
                >
                  A very catchy slogan
                </Title>
                <Title as="p" subtitle>
                  <span>
                    Yeah yeah, we get it. You do this, that and probably
                    something else too.
                  </span>
                </Title>
              </header>
            </Column>
            <Column size={1} />
            <Column>
              <Image.Container>
                <LandingPageSvg />
              </Image.Container>
            </Column>
          </Column.Group>
        </Container>
      </Hero>
    </>
  );
});
