'use server';

import { cookies } from 'next/headers';

const COOKIE_NAME = 'NEXT_LOCALE';

export async function setUserLocale(locale: string): Promise<void> {
  cookies().set(COOKIE_NAME, locale);
}
