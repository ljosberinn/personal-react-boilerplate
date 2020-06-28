import { ComponentTheme } from '@chakra-ui/theme-tools';

const Stat: ComponentTheme = {
  baseStyle: {
    HelpText: {
      marginBottom: 2,
      opacity: 0.8,
    },
    Label: {
      fontWeight: 'medium',
    },
    Number: {
      fontWeight: 'semibold',
      verticalAlign: 'baseline',
    },
  },
  defaultProps: {
    size: 'md',
  },
  /**
   * Only one size specified but you can add more,
   * and style each part.
   */
  sizes: {
    md: {
      HelpText: {
        fontSize: 'sm',
      },
      Label: {
        fontSize: 'sm',
      },
      Number: {
        fontSize: '2xl',
      },
    },
  },
};

export const StatSizes = {
  md: 'md',
};

export default Stat;
