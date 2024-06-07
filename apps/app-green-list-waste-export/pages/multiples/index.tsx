import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import {
  UploadBreadCrumbs,
  GuidanceInteruption,
  Instructions,
  PageLayout,
  UploadForm,
} from 'features/multiples';
import { useQueryClient } from '@tanstack/react-query';

function Upload(): React.ReactNode {
  const queryClient = useQueryClient();
  const [cookies, setCookie] = useCookies(['GLWMultipleGuidanceViewed']);
  const [showGuidance, setShowGuidance] = useState<boolean>(false);

  useEffect(() => {
    if (!cookies.GLWMultipleGuidanceViewed) {
      setShowGuidance(true);
    }

    queryClient.removeQueries({
      queryKey: ['multiples'],
    });
  }, [cookies, setCookie]);

  function acknowledgeGuidance(): void {
    setCookie('GLWMultipleGuidanceViewed', 'true', {
      maxAge: 2592000,
    });
    setShowGuidance(false);
  }

  if (showGuidance) {
    return (
      <PageLayout breadCrumbs={<UploadBreadCrumbs />} setWidth="full">
        <GuidanceInteruption acknowledgeGuidance={acknowledgeGuidance} />
      </PageLayout>
    );
  }

  return (
    <PageLayout breadCrumbs={<UploadBreadCrumbs />}>
      <UploadForm>
        <Instructions />
      </UploadForm>
    </PageLayout>
  );
}

export default Upload;
Upload.auth = true;
