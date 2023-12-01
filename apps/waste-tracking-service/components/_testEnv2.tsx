import React from 'react';
import * as GovUK from 'govuk-react';

export const TestEnvComponent2 = () => {
  return (
    <GovUK.OrderedList>
      <GovUK.ListItem>
        NEXT_PUBLIC_COOKIE_CONSENT_NAME in a component in components folder:{' '}
        {process.env.NEXT_PUBLIC_COOKIE_CONSENT_NAME}
      </GovUK.ListItem>
      <GovUK.ListItem>
        NEXT_PUBLIC_GOOGLE_ANALYTICS_ACCOUNT in a component in components
        folder: {process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ACCOUNT}
      </GovUK.ListItem>
    </GovUK.OrderedList>
  );
};
