import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Title, Input, Field, Control, Box } from 'rbx';
import { validate } from '../../../../utils/validators';
import { Icon } from '../../../../components';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

export default function ChangeMail({ updateMail }) {
  const { t } = useTranslation('settings');
  const [newMail, setNewMail] = useState(null);
  const [repeatedNewMail, setRepeatedNewMail] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = useCallback(({ target: { value, name } }) => {
    switch (name) {
      case 'newMail':
        setNewMail(value);
        break;
      case 'repeatedNewMail':
        setRepeatedNewMail(value);
        break;
      default:
        throw new Error('missing case');
    }
  }, []);

  const handleSubmit = useCallback(
    async event => {
      event.preventDefault();
      setIsLoading(true);

      await updateMail(newMail);

      setIsLoading(false);
    },
    [updateMail, newMail],
  );

  const isDisabled =
    !newMail || !repeatedNewMail || newMail !== repeatedNewMail;

  return (
    <Box>
      <form spellCheck={false} onSubmit={handleSubmit}>
        <legend>
          <Title as="h3">{t('changeMail')}</Title>
        </legend>

        <fieldset disabled={isLoading}>
          <Field>
            <Control iconLeft>
              <Input
                type="mail"
                name="newMail"
                required
                onChange={handleChange}
                placeholder="enter new mail"
              />
              <Icon
                align="left"
                icon={faEnvelope}
                color={
                  newMail && validate.mail(newMail) ? 'success' : undefined
                }
              />
            </Control>
          </Field>

          <Field>
            <Control iconLeft>
              <Input
                type="mail"
                name="repeatedNewMail"
                required
                onChange={handleChange}
                placeholder="repeat new mail"
              />
              <Icon
                align="left"
                icon={faEnvelope}
                color={
                  newMail &&
                  repeatedNewMail &&
                  newMail === repeatedNewMail &&
                  validate.mail(newMail)
                    ? 'success'
                    : undefined
                }
              />
            </Control>
          </Field>

          <Button
            type="submit"
            state={isLoading ? 'loading' : undefined}
            color="primary"
            disabled={isDisabled}
          >
            {t('changeMail')}
          </Button>
        </fieldset>
      </form>
    </Box>
  );
}
