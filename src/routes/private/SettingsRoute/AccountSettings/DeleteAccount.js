import { Button, Modal, Delete } from 'rbx';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FaTimesCircle, FaSkullCrossbones } from 'react-icons/fa';

import { Icon } from '../../../../components';

/**
 * @param {{
 * user: import('react-netlify-identity').User
 * }}
 */
export default function DeleteAccount({ user }) {
  const [userEngagedDeletion, setUserEngagedDeletion] = useState(false);
  const [hasApproved, setHasApproved] = useState(false);
  const [error, setError] = useState(null);
  const { t } = useTranslation('settings');

  useEffect(() => {
    async function deleteUser() {
      try {
        await user.delete();
      } catch (error) {
        setError(error.message);
      }
    }

    const timeout = hasApproved && setTimeout(deleteUser, 10000);

    return () => clearTimeout(timeout);
  }, [hasApproved, user]);

  const handleAbort = () => {
    setHasApproved(false);
    setUserEngagedDeletion(false);
  };

  return (
    <>
      <Button color="danger" onClick={() => setUserEngagedDeletion(true)}>
        {t('deleteAccountBtnText')}
      </Button>
      {userEngagedDeletion && (
        <Modal active closeOnBlur closeOnEsc onClose={handleAbort}>
          <Modal.Background />

          <Modal.Card>
            <Modal.Card.Head>
              <Modal.Card.Title>{t('warning')}</Modal.Card.Title>
              <Delete />
            </Modal.Card.Head>
            <Modal.Card.Body>
              {!hasApproved && <p>{t('deleteAccountInfo')}</p>}

              {hasApproved && !error && <p>{t('deleteAccountGoodbye')}</p>}

              {error && error}
            </Modal.Card.Body>
            <Modal.Card.Foot>
              {!hasApproved ? (
                <Button.Group>
                  <Button onClick={handleAbort} color="warning">
                    <Icon svg={FaTimesCircle} />
                    <span>{t('deleteAccountAbort')}</span>
                  </Button>

                  <Button onClick={() => setHasApproved(true)} color="danger">
                    <Icon svg={FaSkullCrossbones} />
                    <span>{t('deleteAccountConfirm')}</span>
                  </Button>
                </Button.Group>
              ) : (
                <Button color="warning" onClick={handleAbort}>
                  {t('deleteAccountAbort2')}
                </Button>
              )}
            </Modal.Card.Foot>
          </Modal.Card>
        </Modal>
      )}
    </>
  );
}
