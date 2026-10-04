import React from 'react';
import { DemoDataBanner } from './DemoDataBanner';
import { NotifyPromptCard } from './NotifyPromptCard';
import { useDemoData } from './useDemoData';

// Top of every tab: sample-data banner, then (after "start with my data" and the first
// profile) the one-time offer to turn on device notifications.
export function OnboardingArea({ profiles, expenses, documents, onDataReset }) {
  const demo = useDemoData({ profiles, expenses, documents }, onDataReset);
  const askNotifications = !demo.mode && demo.choice === 'fresh' && profiles?.length > 0;
  return (
    <>
      <DemoDataBanner demo={demo} />
      {askNotifications && <NotifyPromptCard />}
    </>
  );
}
