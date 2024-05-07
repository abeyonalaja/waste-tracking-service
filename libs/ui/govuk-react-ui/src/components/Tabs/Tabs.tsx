'use client';

import Link from 'next/link';
import { useState } from 'react';
import { createContext } from 'react';

export const TabContext = createContext<string>('');

type Label = {
  panelId: string;
  label: string;
};

interface TabsProps {
  labels: Label[];
  children?: React.ReactNode;
}

export function Tabs({ labels, children }: TabsProps) {
  const [activeTab, setActiveTab] = useState(labels[0].panelId);

  return (
    <div className="govuk-tabs" data-module="govuk-tabs">
      <ul className="govuk-tabs__list" role="tablist">
        {labels.map((label) => (
          <li
            className={`govuk-tabs__list-item ${
              activeTab === label.panelId
                ? 'govuk-tabs__list-item--selected'
                : ''
            }`}
            role="presentation"
            key={label.panelId}
          >
            <Link
              className="govuk-tabs__tab"
              href={`#`}
              id={`tab_${label.panelId}`}
              role={'tab'}
              aria-controls={label.panelId}
              aria-selected={activeTab === label.panelId}
              onClick={(e) => {
                e.preventDefault();
                setActiveTab(label.panelId);
              }}
            >
              {label.label}
            </Link>
          </li>
        ))}
      </ul>
      <TabContext.Provider value={activeTab}>{children}</TabContext.Provider>
    </div>
  );
}
