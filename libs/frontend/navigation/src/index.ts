// Use this file to export React client components (e.g. those with 'use client' directive) or other non-server utilities
import { createSharedPathnamesNavigation } from 'next-intl/navigation';

export const locales = ['en', 'cy'] as const;
export const localePrefix = 'always'; // Default

export const { Link, redirect, usePathname, useRouter } =
  createSharedPathnamesNavigation({ locales, localePrefix });
