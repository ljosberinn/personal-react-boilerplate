// https://stackoverflow.com/a/32686261
export const isValidMail = mail => {
  if (mail.length === 0) {
    return false;
  }

  try {
    return Object.assign(document.createElement('input'), {
      type: 'email',
      value: mail,
    }).checkValidity();
  } catch (e) {
    // in case of input.checkValidity not being available in some older browsers
    // log the error, so Sentry catches it regardless
    console.error(e);
    // return true because we can't verify the mail at the frontend
    // so the backend has to step in
    return true;
  }
};

export const characterPattern = '[A-Za-z]';
export const passwordMinLength = 8;
export const passwordPattern = `^(?=.*${characterPattern})(?=.*[0-9])(?=.{${passwordMinLength},}).*$`;
export const isValidPassword = password =>
  new RegExp(passwordPattern).test(password);

export const validate = {
  mail: isValidMail,
  password: isValidPassword,
};

export const pattern = {
  password: passwordPattern,
};
