'use client';

import { createContext, useContext } from 'react';

interface NurhausContextValue {
  openWaitlist: (productName: string) => void;
}

export const NurhausContext = createContext<NurhausContextValue>({
  openWaitlist: () => {},
});

export const useNurhaus = () => useContext(NurhausContext);
