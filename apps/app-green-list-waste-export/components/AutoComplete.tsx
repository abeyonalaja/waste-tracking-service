import React from 'react';
import Autocomplete from 'accessible-autocomplete/react';
import i18n from 'i18next';

interface optionType {
  code: string;
  value: {
    description: {
      en?: string;
      cy?: string;
    };
  };
}

interface Props {
  id: string;
  name?: string;
  options: Array<optionType>;
  value: string;
  confirm: (optionType) => void;
}

export const AutoComplete = ({ id, name, options, value, confirm }: Props) => {
  const currentLanguage = i18n.language;
  function suggest(query, populateResults) {
    const searchTerm = query.split(':')[0].toLowerCase();
    const filterResults = (result) => {
      const tempString = `${result.code}: ${result.value.description[currentLanguage]}`;
      return tempString.toLowerCase().indexOf(searchTerm) !== -1;
    };

    const filteredResults = options.filter(filterResults);
    populateResults(filteredResults);
  }

  // How a dropdown menu option appears
  const suggestionTemplate = (suggestion) => {
    return typeof suggestion !== 'string'
      ? `${suggestion?.code}: ${suggestion?.value.description[currentLanguage]}`
      : suggestion;
  };

  // How a selected option appears
  const inputValueTemplate = (suggestion) => {
    return `${suggestion?.code}: ${suggestion?.value.description[currentLanguage]}`;
  };

  const getSelectItemFromCode = (code) => {
    const filteredResult: optionType | undefined = options.find(
      (o: optionType) => o.code === code
    );
    return `${filteredResult?.code}: ${filteredResult?.value.description[currentLanguage]}`;
  };

  return (
    <Autocomplete
      id={id}
      name={name}
      source={suggest}
      showAllValues={true}
      confirmOnBlur={false}
      defaultValue={value === undefined ? '' : getSelectItemFromCode(value)}
      templates={{
        inputValue: inputValueTemplate,
        suggestion: suggestionTemplate,
      }}
      dropdownArrow={() => {
        return;
      }}
      onConfirm={(o) => {
        confirm(o);
      }}
    />
  );
};
