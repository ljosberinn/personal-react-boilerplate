import {
  stringContainsLetter,
  stringContainsNumber,
  upperCaseFirstCharacter,
} from '.';

describe('fn stringContainsLetter', () => {
  it('should return false without any input', () => {
    expect(stringContainsLetter()).toBe(false);
  });

  it('should return false on numbers', () => {
    new Array(9).fill().forEach((_, index) => {
      expect(stringContainsLetter(index.toString())).toBe(false);
      expect(stringContainsLetter(index)).toBe(false);
    });
  });

  it('should return true on a string that does not include numbers', () => {
    expect(stringContainsLetter('abc')).toBe(true);
  });
});

describe('fn stringContainsNumber', () => {
  it('should return false without any input', () => {
    expect(stringContainsNumber()).toBe(false);
  });

  it('should return false on strings without number', () => {
    const str = 'abcdefghi';

    new Array(9).fill().forEach((_, index) => {
      expect(stringContainsNumber(str.substr(0, index + 1))).toBe(false);
    });
  });

  it('should return true on a string that includes a number', () => {
    new Array(9).fill().forEach((_, index) => {
      expect(stringContainsNumber('' + index)).toBe(true);
    });
  });
});

describe('fn upperCaseFirstCharacter', () => {
  it('should uppercase the first character', () => {
    expect(upperCaseFirstCharacter('abc')).toBe('Abc');
  });
});
