import React from 'react';
import { ewc } from '../utils/ewcCodes';
import Autocomplete from 'accessible-autocomplete/react';

interface Props {
  id: string;
  name: string;
  value?: string;
  onChange?: (input) => void;
  errorMessage?: string;
  testId?: string;
}

export const EwcCodeSelector = ({
  id,
  name,
  value,
  onChange,
  errorMessage,
}: Props) => {
  function suggest(query, populateResults) {
    const results = ewc['codes'];
    const formattedResults = results.map((result) => {
      const parts = result.split(':');
      const addSpaces = `${parts[0].replace(/\d{2}(?=.)/g, '$& ')}: ${
        parts[1]
      }`;
      return addSpaces.replace(' *', '');
    });
    const filteredResults = formattedResults.filter((result) => {
      const parts = result.split(':');
      const squashedStr = parts[0].replace(/ /g, '');
      if (squashedStr.indexOf(query.replace(/ /g, '')) !== -1) return result;
    });
    populateResults(filteredResults);
  }

  return (
    <>
      <Autocomplete
        id={id}
        name={name}
        source={suggest}
        showAllValues
        onConfirm={(option) => onChange(option)}
        confirmOnBlur={false}
        defaultValue={value}
        meta={{
          error: errorMessage,
          touched: !!errorMessage,
        }}
      />
    </>
  );
};
