import { LocationDescriptorObject } from 'history';

export function useBreakpointVisibility(): [boolean, () => void];

export function useLocationBasedVisibility(): [boolean, () => void];

export function useDetectColorScheme(): 'dark' | 'light';

export function useMediaQuery(query: string): boolean;

export function useNavigate(): {
  (path: string, state?: unknown): void;
  (location: LocationDescriptorObject<unknown>): void;
};

export function usePrevious(initialValue: any): any;

export function useScrollToTop(behaviour: ScrollBehavior): void;

export function useTimeout(timeout: number): boolean;
