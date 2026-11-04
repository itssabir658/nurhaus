'use client';

import { createContext, useContext } from 'react';

interface NurhausContextValue {
  openWaitlist: (productName: string, productHandle: string) => void;
  openCart: () => void;
}

export const NurhausContext = createContext<NurhausContextValue>({
  openWaitlist: () => {},
  openCart: () => {},
});

export const useNurhaus = () => useContext(NurhausContext);
