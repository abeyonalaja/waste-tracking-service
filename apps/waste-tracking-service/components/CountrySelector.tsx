import React, { FormEvent, useEffect, useState } from 'react';
import i18n from 'i18next';
import * as GovUK from 'govuk-react';
import Autocomplete from 'accessible-autocomplete/react';
import styled from 'styled-components';

type Props = {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (e: FormEvent) => void;
  error: string;
  size?: number;
  hint?: string;
};

type RowProps = {
  size: number;
};

const DropdownWrapper = styled.div<RowProps>`
  @media (min-width: 40.0625em) {
    width: ${(props) => `${props.size * 1}%`};
  }
`;

export const CountrySelector = ({
  id,
  name,
  label,
  value,
  onChange,
  error,
  size = 100,
  hint,
}: Props) => {
  const currentLanguage = i18n.language;
  const [countryList, setCountryList] = useState<string[]>();

  useEffect(() => {
    const fetchData = async () => {
      await fetch(
        `${process.env.NX_API_GATEWAY_URL}/wts-info/countries?language=${currentLanguage}`
      )
        .then((response) => {
          if (response.ok) return response.json();
        })
        .then((data) => {
          if (data !== undefined) {
            if (data.length > 0) {
              const filteredData = data.map((c) => c.description);
              setCountryList(filteredData);
            } else {
              setCountryList([]);
            }
          }
        });
    };
    fetchData();
  }, [currentLanguage]);

  const suggest = (query, populateResults) => {
    const filteredResults = countryList.filter(
      (c) => c.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
    populateResults(filteredResults);
  };

  return (
    <GovUK.FormGroup error={!!error}>
      <GovUK.Label htmlFor="country">
        <GovUK.LabelText>{label}</GovUK.LabelText>
      </GovUK.Label>
      {hint && <GovUK.HintText>{hint}</GovUK.HintText>}
      {error && <GovUK.ErrorText>{error}</GovUK.ErrorText>}
      <DropdownWrapper size={size}>
        <Autocomplete
          id={id}
          name={name}
          source={suggest}
          onConfirm={(option) => onChange(option)}
          showAllValues={true}
          confirmOnBlur={false}
          defaultValue={value}
          dropdownArrow={() => {
            return;
          }}
        />
      </DropdownWrapper>
    </GovUK.FormGroup>
  );
};
