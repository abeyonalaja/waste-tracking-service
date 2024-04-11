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
  children,
}: AppInsightsProviderProps) {
  const reactPlugin = new ReactPlugin();

  useEffect(() => {
    async function startAppInsights() {
      const baseUrl =
        process.env['NODE_ENV'] === 'production'
          ? '/export-annex-VII-waste'
          : '';

      try {
        const res = await fetch(`${baseUrl}/api/env`);
        const data = await res.json();
        const connectionString = data.APPINSIGHTS_CONNECTION_STRING;
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
          console.log('Starting AppInsights');
          appInsights.loadAppInsights();
        }
      } catch (err) {
        console.error(err);
      }
    }
    startAppInsights();
  }, []);

  return (
    <AppInsightsContext.Provider value={reactPlugin}>
      {children}
    </AppInsightsContext.Provider>
  );
}
