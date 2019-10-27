import React, { useState, useEffect } from 'react';
import { Button, Modal, Delete } from 'rbx';
import { Icon } from '../../../../components';
import {
  faTimesCircle,
  faSkullCrossbones,
} from '@fortawesome/free-solid-svg-icons';

export default function DeleteAccount({ user }) {
  const [userEngagedDeletion, setUserEngagedDeletion] = useState(false);
  const [hasApproved, setHasApproved] = useState(false);
  const [error, setError] = useState('some error');

  useEffect(() => {
    async function deleteUser() {
      try {
        await user.delete();
      } catch (error) {
        setError(error.message);
      }
    }

    const timeout = hasApproved && setTimeout(deleteUser, 5000);

    return () => clearTimeout(timeout);
  }, [hasApproved, user]);

  const handleAbort = () => {
    setHasApproved(false);
    setUserEngagedDeletion(false);
  };

  if (!userEngagedDeletion) {
    return (
      <Button color="danger" onClick={() => setUserEngagedDeletion(true)}>
        Delete Your Account
      </Button>
    );
  }

  return (
    <Modal active closeOnBlur closeOnEsc onClose={handleAbort}>
      <Modal.Background />

      <Modal.Card>
        <Modal.Card.Head>
          <Modal.Card.Title>Warning</Modal.Card.Title>
          <Delete />
        </Modal.Card.Head>
        <Modal.Card.Body>
          {userEngagedDeletion && !hasApproved && (
            <p>You're in the process of deleting your account!</p>
          )}

          {hasApproved && !error && (
            <p>Sad to see you go. Your account will be deleted in 5 seconds.</p>
          )}

          {error && error}
        </Modal.Card.Body>
        <Modal.Card.Foot>
          {userEngagedDeletion && !hasApproved && (
            <Button.Group>
              <Button onClick={handleAbort} color="warning">
                <Icon icon={faTimesCircle} />
                <span>No, please take me back.</span>
              </Button>

              <Button onClick={() => setHasApproved(true)} color="danger">
                <Icon icon={faSkullCrossbones} />
                <span>Yes, delete my account.</span>
              </Button>
            </Button.Group>
          )}

          {hasApproved && (
            <Button color="warning" onClick={handleAbort}>
              I changed my mind!
            </Button>
          )}
        </Modal.Card.Foot>
      </Modal.Card>
    </Modal>
  );
}
