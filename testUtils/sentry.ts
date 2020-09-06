import { Scope } from '@sentry/react';

export const createMockScope = ({
  addBreadcrumb = jest.fn(),
  addEventProcessor = jest.fn(),
  clear = jest.fn(),
  clearBreadcrumbs = jest.fn(),
  getSpan = jest.fn(),
  getTransaction = jest.fn(),
  setContext = jest.fn(),
  setExtra = jest.fn(),
  setExtras = jest.fn(),
  setFingerprint = jest.fn(),
  setLevel = jest.fn(),
  setSpan = jest.fn(),
  setTag = jest.fn(),
  setTags = jest.fn(),
  setTransactionName = jest.fn(),
  setUser = jest.fn(),
  update = jest.fn(),
  addScopeListener = jest.fn(),
}: Partial<Scope>): Scope => {
  class MockScope extends Scope {
    _breadcrumbs = [];

    _contexts = [];

    _eventProcessors = [];

    _extra = {};

    _fingerprint = [];

    _level: undefined;

    _notifyEventProcessors = jest.fn();

    _notifyScopeListeners = jest.fn();

    _scopeListeners = [];

    _span = undefined;

    _tags = {};

    _transactionName = '';

    _user = {};

    addBreadcrumb = jest.fn().mockImplementation(addBreadcrumb);

    addEventProcessor = jest.fn().mockImplementation(addEventProcessor);

    clear = jest.fn().mockImplementation(clear);

    clearBreadcrumbs = jest.fn().mockImplementation(clearBreadcrumbs);

    getSpan = getSpan;

    getTransaction = getTransaction;

    setContext = jest.fn().mockImplementation(setContext);

    setExtra = jest.fn().mockImplementation(setExtra);

    setExtras = jest.fn().mockImplementation(setExtras);

    setFingerprint = jest.fn().mockImplementation(setFingerprint);

    setLevel = jest.fn().mockImplementation(setLevel);

    setSpan = jest.fn().mockImplementation(setSpan);

    setTag = jest.fn().mockImplementation(setTag);

    setTags = jest.fn().mockImplementation(setTags);

    setTransactionName = jest.fn().mockImplementation(setTransactionName);

    setUser = jest.fn().mockImplementation(setUser);

    update = jest.fn().mockImplementation(update);

    addScopeListener = addScopeListener;

    setTransaction = jest.fn();

    applyToEvents = jest.fn();

    applyToEvent = jest.fn();

    protected _notifyingListeners = false;
  }

  return new MockScope();
};
