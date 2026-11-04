'use client';

import { createContext, useContext } from 'react';

interface NurhausContextValue {
  openCart: () => void;
}

export const NurhausContext = createContext<NurhausContextValue>({
  openCart: () => {},
});

export const useNurhaus = () => useContext(NurhausContext);
