'use client';

import React from 'react';
import { TabContext } from '../Tabs/Tabs';

interface TabsPanelProps {
  id: string;
  children: React.ReactNode;
}

export function TabsPanel({ id, children }: TabsPanelProps): JSX.Element {
  const activeTab = React.useContext(TabContext);

  return (
    <div
      className={`govuk-tabs__panel ${
        activeTab === id ? '' : 'govuk-tabs__panel--hidden'
      }`}
      id={id}
      role="tabpanel"
      aria-labelledby={`tab_${id}`}
    >
      {children}
    </div>
  );
}
