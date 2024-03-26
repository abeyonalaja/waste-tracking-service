import React, { FormEvent, useEffect, useState } from 'react';
import i18n from 'i18next';
import * as GovUK from 'govuk-react';
import Autocomplete from 'accessible-autocomplete/react';
import styled from 'styled-components';
import { Loading } from './Loading';

type Props = {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (e: FormEvent) => void;
  error: string;
  size?: number;
  hint?: string;
  apiConfig: HeadersInit;
  includeUk?: boolean;
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
  apiConfig,
  includeUk = false,
}: Props) => {
  const currentLanguage = i18n.language;
  const [countryList, setCountryList] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/reference-data/countries?includeUk=${includeUk}`,
        { headers: apiConfig }
      )
        .then((response) => {
          if (response.ok) return response.json();
        })
        .then(async (data) => {
          if (data !== undefined) {
            if (data.length > 0) {
              const filteredData = data.map((c) => c.name);
              setCountryList(filteredData);
              setIsLoading(false);
            } else {
              setCountryList([]);
              setIsLoading(false);
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
    <>
      <>
        <GovUK.FormGroup error={!!error}>
          <GovUK.Label htmlFor="country">
            <GovUK.LabelText>{label}</GovUK.LabelText>
          </GovUK.Label>
          {hint && <GovUK.HintText>{hint}</GovUK.HintText>}
          {error && <GovUK.ErrorText>{error}</GovUK.ErrorText>}
          {isLoading && <Loading />}
          {!isLoading && (
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
          )}
        </GovUK.FormGroup>
      </>
    </>
  );
};
