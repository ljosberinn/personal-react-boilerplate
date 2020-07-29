import { ReactElement, ReactNode } from 'react';

/**
 * Wrapper for ModernFunctionComponent<T>
 *
 * React.FC, without the issues.
 *
 * - no implicit, always present, optional children
 * - no propTypes: use TS interfaces/types
 * - no legacy contextTypes or childContextTypes
 * - no default props: use function default parameters
 *
 * @example
 * ```ts
 * // without children
 * const MyComponent: PFC<MyComponentProps> = (props) => {}
 *
 * // with children
 * const MyComponent: PFC<MyComponentProps & WithChildren> = (props) => {}
 *
 * // or
 *
 * interface MyComponentProps extends WithChildren {
 *  value: string;
 * }
 *
 * // or as type: type MyComponentProps = { value: string } & WithChildren
 *
 * const MyComponent: PFC<MyComponentProps> = (props) => {}
 * ```
 *
 * @see https://github.com/facebook/create-react-app/pull/8177
 */
export type MFC<T = {}> = ModernFunctionComponent<T>;

interface ModernFunctionComponent<T = {}> {
  (props: T, context?: any): ReactElement<any, any> | null;
  displayName?: string;
}

export interface WithChildren {
  children: ReactNode;
}
