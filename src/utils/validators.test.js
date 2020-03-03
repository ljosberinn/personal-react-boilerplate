import { passwordMinLength, isValidPassword, isValidMail } from './validators';

describe('fn isValidPassword', () => {
  const validPassword = 'a1234567';

  it(`should accept only passwords of length ${passwordMinLength} or higher`, () => {
    new Array(validPassword.length).fill().map((_, index) => {
      const chunk = validPassword.substr(0, index);

      expect(isValidPassword(chunk)).toBe(chunk.length >= passwordMinLength);
    });
  });

  it('should not allow passwords without a number', () => {
    expect(isValidPassword('abcdefghi')).toBe(false);
  });

  it('should not allow passwords without a character', () => {
    expect(isValidPassword('12345678')).toBe(false);
  });
});

describe('fn isValidMail', () => {
  it('should return true given a valid mail', () => {
    expect(isValidMail('foo@bar.baz')).toBe(true);
  });

  it('should return false given an invalid mail', () => {
    expect(isValidMail(1)).toBe(false);
  });
});
