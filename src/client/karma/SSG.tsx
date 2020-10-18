import { KarmaCore } from './Core';
import type { WithChildren, KarmaCoreProps } from './types';

export type KarmaSSGProps = Omit<KarmaCoreProps, 'mode'>;

export function KarmaSSG({
  children,
  ...rest
}: WithChildren<KarmaSSGProps>): JSX.Element {
  return (
    <KarmaCore {...rest} mode="ssg">
      {children}
    </KarmaCore>
  );
}
