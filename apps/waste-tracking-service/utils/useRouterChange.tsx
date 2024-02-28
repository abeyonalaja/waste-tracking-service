import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

// Necessary to avoid abort fetching error on mulitples forwarding once processing complete
// Hook taken from:
// https://stackoverflow.com/questions/73343986/next-js-abort-fetching-component-for-route-login

const useSafePush = () => {
  const [onChanging, setOnChanging] = useState(false);
  const handleRouteChange = () => {
    setOnChanging(false);
  };
  const router = useRouter();
  // safePush is used to avoid route pushing errors when users click multiple times or when the network is slow:  "Error: Abort fetching component for route"
  const safePush = (path: string) => {
    if (onChanging) {
      return;
    }
    setOnChanging(true);
    router.push(path);
  };

  useEffect(() => {
    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router, setOnChanging]);
  return { safePush };
};

export default useSafePush;
