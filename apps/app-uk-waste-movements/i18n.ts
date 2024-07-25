// import { notFound } from 'next/navigation';
// import { getRequestConfig } from 'next-intl/server';

// const locales = ['en', 'cy'];

// export default getRequestConfig(async ({ locale }) => {
//   if (!locales.includes(locale as string)) notFound();

//   return {
//     messages: (await import(`./messages/${locale}.json`)).default,
//   };
// });

import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';

export default getRequestConfig(async () => {
  const cookieStore = cookies();
  const localeCookie = cookieStore.get('NEXT_LOCALE');
  const locale = localeCookie?.value || 'en';

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
