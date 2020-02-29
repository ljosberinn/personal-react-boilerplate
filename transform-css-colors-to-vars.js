const CSSOM = require('cssom');
const { readFileSync, writeFileSync, unlinkSync } = require('fs');

const lightTheme = 'src/assets/light.css';
const darkTheme = 'src/assets/dark.css';

const possibleColorDeclarations = [
  'background',
  'background-color',
  'color',
  'fill',
  'box-shadow',
  'border',
  'border-color',
  'border-top-color',
  'border-left-color',
  'border-right-color',
  'border-bottom-color',
];

const isStyleRule = rule => rule instanceof CSSOM.CSSStyleRule;
const isMediaRule = rule => rule instanceof CSSOM.CSSMediaRule;

const hasColorDeclarations = rule => {
  if (isMediaRule(rule)) {
    return possibleColorDeclarations.some(prop => !!rule.cssRules[prop]);
  }

  if (isStyleRule(rule)) {
    return possibleColorDeclarations.some(prop => !!rule.style[prop]);
  }

  return false;
};

const findBySelector = (stylesheet, selector) =>
  stylesheet.cssRules.find(rule => {
    if (isStyleRule(rule)) {
      return rule.selectorText === selector;
    }

    if (isMediaRule(rule)) {
      return rule.cssRules.find(subRule => subRule.selectorText === selector);
    }

    return null;
  });

const unwantedBulmaswatchOverrides = [['.button', '.is-hovered']];

const filterUnwantedBulmaswatchOverrides = rule =>
  !(
    (isStyleRule(rule) &&
      unwantedBulmaswatchOverrides.some(tuple =>
        tuple.every(filter => rule.selectorText.includes(filter)),
      )) ||
    (isMediaRule(rule) &&
      rule.cssRules.some(subRule =>
        unwantedBulmaswatchOverrides.some(tuple =>
          tuple.every(filter => subRule.selectorText.includes(filter)),
        ),
      ))
  );

const collection = [];

const fallbackMap = {
  '.tooltip:hover::before, .tooltip.is-tooltip-active::before': {
    color: '#fff',
    background: 'rgba(74,74,74,.9)',
  },
};

const overrideMap = {
  '.input, .textarea, .select select': {
    color: 'inherit',
  },
};

let i = 0;

const generateId = () => `--c${i}`;

console.log(`parsing stylesheets into AST`);
const lightStyleSheet = CSSOM.parse(readFileSync(lightTheme).toString());
const darkStyleSheet = CSSOM.parse(readFileSync(darkTheme).toString());

writeFileSync(
  'public/app.css',
  darkStyleSheet.cssRules
    .filter(filterUnwantedBulmaswatchOverrides)
    .map(rule => {
      if (hasColorDeclarations(rule)) {
        // verify this rule has a twin in the other stylesheet
        const twin = findBySelector(lightStyleSheet, rule.selectorText);

        if (!twin) {
          return rule.cssText;
        }

        // extract color definitions
        possibleColorDeclarations.forEach(prop => {
          // the current color of a dark declaration
          const value = rule.style[prop]
            ? rule.style[prop].toLowerCase()
            : null;

          if (value) {
            // the current color of the corresponding light declaration
            const twinProp = twin.style[prop]
              ? twin.style[prop].toLowerCase()
              : null;

            if (twinProp !== value) {
              // check whether we can recycle a selector
              const previousEntry = collection.find(
                dataset => dataset.dark === value && dataset.light === twinProp,
              );
              const id = previousEntry ? previousEntry.id : generateId();

              const override = overrideMap[rule.selectorText];
              // no stored match, thus store
              if (!previousEntry) {
                const fallback = fallbackMap[rule.selectorText];

                collection.push({
                  dark: value,
                  light:
                    (override && override[prop]) ||
                    (fallback && fallback[prop]) ||
                    twinProp ||
                    '#fff',
                  id,
                });

                i++;
              }

              if (!override) {
                // mutate rule
                rule.style.setProperty(
                  prop,
                  `var(${id})`,
                  rule.style.getPropertyPriority(prop),
                );
              }
            }
          }
        });
      }

      return rule.cssText;
    })
    .join('')
    .replace(/(\r\n|\r|\n)/gim, ''),
);
console.log(`wrote stylesheet to "public/app.css"`);

/**
 *
 * @param {Array} collection
 * @param {'dark' | 'light'} key
 */
const buildRoot = (collection, key) =>
  collection.map(dataset => `${dataset.id}:${dataset[key]};`).join('');

writeFileSync(
  'public/root.css',
  ['dark', 'light']
    .map(theme => `[data-theme="${theme}"]{${buildRoot(collection, theme)}}`)
    .join(''),
);

console.log(`wrote root vars  to "public/root.css`);

[lightTheme, darkTheme].forEach(unlinkSync);

console.log(`removed precompiled themes, done transforming css`);
