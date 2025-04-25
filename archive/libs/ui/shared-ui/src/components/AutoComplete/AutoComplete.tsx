'use client';

import React from 'react';
// @ts-expect-error This is needed to suppress the TypeScript error because the
// 'accessible-autocomplete/react' library does not have TypeScript declarations.
import Autocomplete from 'accessible-autocomplete/react';
import './AutoComplete.scss';
import { useLocale } from 'next-intl';

interface OptionType {
  code: string;
  description: {
    en: string;
    cy: string;
  };
}

interface Props {
  id: string;
  name?: string;
  options: OptionType[];
  value?: OptionType;
  confirm: (option: OptionType) => void;
}

export const AutoComplete = ({
  id,
  name,
  options,
  value,
  confirm,
}: Props): React.ReactNode => {
  const locale = useLocale() as 'en' | 'cy';

  function suggest(
    query: string,
    populateResults: (results: OptionType[]) => void,
  ) {
    const searchTerm = query.split(':')[0].toLowerCase();
    const filterResults = (result: OptionType) => {
      const tempString = `${result.code}: ${result.description[locale]}`;
      return tempString.toLowerCase().indexOf(searchTerm) !== -1;
    };

    const filteredResults = options.filter(filterResults);
    populateResults(filteredResults);
  }

  // How a dropdown menu option appears
  const suggestionTemplate = (suggestion: OptionType | string) => {
    return typeof suggestion !== 'string'
      ? `${suggestion?.code}: ${suggestion?.description[locale]}`
      : suggestion;
  };

  // How a selected option appears
  const inputValueTemplate = (suggestion: OptionType) => {
    return `${suggestion?.code}: ${suggestion?.description[locale]}`;
  };

  const getSelectItemFromCode = (code: string) => {
    const filteredResult = options.find((option) => option.code === code);
    return `${filteredResult?.code}: ${filteredResult?.description[locale]}`;
  };

  return (
    <Autocomplete
      id={id}
      name={name}
      source={suggest}
      showAllValues={true}
      confirmOnBlur={false}
      defaultValue={
        value === undefined ? '' : getSelectItemFromCode(value.code)
      }
      templates={{
        inputValue: inputValueTemplate,
        suggestion: suggestionTemplate,
      }}
      dropdownArrow={() => {
        return;
      }}
      onConfirm={(option: OptionType) => {
        confirm(option as OptionType);
      }}
    />
  );
};

export default AutoComplete;
