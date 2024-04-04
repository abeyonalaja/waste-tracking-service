'use client';

import { AppInsightsContext } from '@microsoft/applicationinsights-react-js';
import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import { ReactPlugin } from '@microsoft/applicationinsights-react-js';
import { ClickAnalyticsPlugin } from '@microsoft/applicationinsights-clickanalytics-js';
import { useEffect } from 'react';

interface AppInsightsProviderProps {
  connectionString: string;
  children: React.ReactNode;
}

export default function AppInsightsProvider({
  connectionString,
  children,
}: AppInsightsProviderProps) {
  const reactPlugin = new ReactPlugin();

  useEffect(() => {
    const clickPluginInstance = new ClickAnalyticsPlugin();
    const clickPluginConfig = {
      autoCapture: true,
    };

    const appInsights = new ApplicationInsights({
      config: {
        connectionString: connectionString,
        maxBatchSizeInBytes: 10000,
        maxBatchInterval: 15000,
        enableAutoRouteTracking: true,
        extensions: [reactPlugin, clickPluginInstance],
        extensionConfig: {
          [reactPlugin.identifier]: {},
          [clickPluginInstance.identifier]: clickPluginConfig,
        },
      },
    });

    if (connectionString) {
      appInsights.loadAppInsights();
    }
    return () => {
      appInsights.unload();
    };
  }, []);

  return (
    <AppInsightsContext.Provider value={reactPlugin}>
      {children}
    </AppInsightsContext.Provider>
  );
}
