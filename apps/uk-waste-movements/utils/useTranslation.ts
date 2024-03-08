import { default as content } from '../content/en.json';

interface LanguageObject {
  [key: string]: LanguageObject | string;
}
let language: LanguageObject = {};

function t(key: string) {
  if (key in language) {
    if (typeof language[key] === 'string') {
      return language[key].toString();
    }
  } else {
    const keys = key.split('.');
    const filteredKey = keys[0];
    const filtered: LanguageObject | string = language[filteredKey];
    if (typeof filtered === 'object') {
      if (keys[1] in filtered) {
        if (typeof filtered[keys[1]] === 'string') {
          return filtered[keys[1]].toString();
        }
      }
    }
  }
  return key.toString();
}

export function useTranslation(context: string) {
  if (context in content) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    language = content[context];
  } else {
    language = content;
  }
  return { t };
}
