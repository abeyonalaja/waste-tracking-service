import React from 'react';
import * as GovUK from 'govuk-react';

const TestEnvComponent = () => {
  return (
    <GovUK.OrderedList>
      <GovUK.ListItem>
        NEXT_PUBLIC_COOKIE_CONSENT_NAME in a component in pages folder:{' '}
        {process.env.NEXT_PUBLIC_COOKIE_CONSENT_NAME}
      </GovUK.ListItem>
      <GovUK.ListItem>
        NEXT_PUBLIC_GOOGLE_ANALYTICS_ACCOUNT in a component in pages folder:{' '}
        {process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ACCOUNT}
      </GovUK.ListItem>
    </GovUK.OrderedList>
  );
};

export default TestEnvComponent;
