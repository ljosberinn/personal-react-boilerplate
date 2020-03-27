import { Spinner } from '@chakra-ui/core';
import load, { DefaultComponent } from '@loadable/component';
import React from 'react';

type PathArguments = { [key: string]: string | number };

const PATH_DELIMITER = '/';
const VARIABLE_DELIMITER = ':';
const OPTIONAL_VARIABLE_DELIMITER = '?';

export const dynamicPathFactory = (
  targetPath: string
): ((args?: PathArguments) => string) => {
  return args => {
    if (!args) {
      return targetPath;
    }

    const [, ...params] = targetPath.split(PATH_DELIMITER);

    const paramCount = params.length - 1;

    let bailEarly = false;

    return (
      PATH_DELIMITER +
      params
        .reduce((carry, param, index) => {
          if (bailEarly) {
            return carry;
          }

          if (!param.startsWith(VARIABLE_DELIMITER)) {
            return [...carry, param];
          }

          const isOptional = param.endsWith(OPTIONAL_VARIABLE_DELIMITER);

          const sanitizedParam = param.slice(
            1,
            isOptional ? param.length - 1 : undefined
          );

          const value = args[sanitizedParam];

          if (!value) {
            if (isOptional) {
              if (index < paramCount) {
                bailEarly = true;
              }

              return carry;
            }

            throw new Error(
              `unknown param "${param}" provided to path "${targetPath}"`
            );
          }

          return [...carry, value];
        }, [])
        .join(PATH_DELIMITER)
    );
  };
};

export const loadable = (
  component: (props: unknown) => Promise<DefaultComponent<unknown>>
) =>
  load(component, {
    fallback: (
      <Spinner thickness="4px" speed="0.65s" emptyColor="blue.500" size="xl" />
    ),
  });
