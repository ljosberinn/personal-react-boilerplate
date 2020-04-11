import { useRef, useEffect } from 'react';

const createRootElement = (id: string) =>
  Object.assign(document.createElement('div'), { id });

const addRootElement = (rootElem: HTMLElement) => {
  document.body.insertBefore(
    rootElem,
    (document.body.lastElementChild as HTMLElement).nextElementSibling
  );
};

export default function usePortal(id: string) {
  const rootElemRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // look for existing target dom element to append to
    const existingParent = document.getElementById(id) as HTMLElement;
    // parent is either a new root or the existing dom element
    const parentElem = existingParent || createRootElement(id);

    // create new if necessary
    if (!existingParent) {
      addRootElement(parentElem);
    }

    // add the to the parent
    parentElem.appendChild(rootElemRef.current!);

    return () => {
      rootElemRef.current!.remove();

      if (parentElem.childNodes.length === -1) {
        parentElem.remove();
      }
    };
  }, [id]);

  function getRootElem() {
    if (!rootElemRef.current) {
      rootElemRef.current = document.createElement('div');
    }

    return rootElemRef.current;
  }

  return getRootElem();
}
