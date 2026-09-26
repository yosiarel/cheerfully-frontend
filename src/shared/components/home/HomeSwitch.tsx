'use client';

import { useSession } from 'next-auth/react';
import { LandingPage } from './LandingPage';
import { LoggedInHome } from './LoggedInHome';

export function HomeSwitch() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return null;
  }

  if (session) {
    return <LoggedInHome />;
  }

  return <LandingPage />;
}
