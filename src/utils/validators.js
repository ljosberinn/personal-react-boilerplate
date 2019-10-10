// https://stackoverflow.com/a/32686261
const isValidMail = mail => {
  if (mail.length === 0) {
    return false;
  }

  try {
    const input = Object.assign(document.createElement('input'), {
      type: 'email',
      value: mail,
    });

    return input.checkValidity();
  } catch (e) {
    // in case of input.checkValidity not being available in some older browsers
    // log the error, so Sentry catches it regardless
    console.error(e);
    // return true because we can't verify the mail at the frontend
    // so the backend has to step in
    return true;
  }
};

const allowedSpecialCharacters = [
  '!',
  '"',
  '§',
  '$',
  '%',
  '&',
  '/',
  '(',
  ')',
  '=',
  '?',
  ',',
  '.',
  ';',
  ':',
  '_',
  '-',
];
const characterPattern = '[A-Za-z]';
const passwordPattern = `^(?=.*${characterPattern})(?=.*[0-9])(?=.*[${allowedSpecialCharacters.join(
  '',
)}])(?=.{8,}).*$`;

const isValidPassword = password => new RegExp(passwordPattern).test(password);

const usernamePattern = '^[a-zA-Z0-9]+(?:[._ -]?[a-zA-Z0-9])*$';

const isValidUsername = userName => new RegExp(usernamePattern).test(userName);

const namePattern =
  "^[a-zA-Z àáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð'-]+$";

const isValidRealName = name => new RegExp(namePattern).test(name);

const validate = {
  mail: isValidMail,
  password: isValidPassword,
  username: isValidUsername,
  realName: isValidRealName,
};

const pattern = {
  mail: '',
  password: passwordPattern,
  userName: usernamePattern,
  realName: namePattern,
};

export { validate, pattern, allowedSpecialCharacters, characterPattern };
