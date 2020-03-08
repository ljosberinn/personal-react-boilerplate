import { LocationDescriptorObject } from 'history';
import { IconType } from 'react-icons';
import { LoadableComponent } from 'react-loadable';

interface Route {
  routerPath: string;
  clientPath: string;
  component: LoadableComponent;
  title: string;
  visibleInDrawerNav: boolean;
  icon?: IconType;
}

export function useNavigationContext(): {
  PreloadingLink: React.Component<{ to: Route }>;
  routes: {
    [key: string]: Route;
  };
};

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

export function useTheme(): {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
};
export function useServiceWorker(): {
  isSupported: boolean;
  registration?: ServiceWorkerRegistration;
  options?: RegistrationOptions;
};

export function useTimeout(timeout: number): boolean;
