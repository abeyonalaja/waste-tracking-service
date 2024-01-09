import { useEffect, useState } from 'react';
import i18n from 'i18next';

type singleCodeType = {
  code: string;
  value: {
    description: {
      en: string;
      cy: string;
    };
  };
};

type codeCollection = {
  type: string;
  values: Array<singleCodeType>;
};

const useRefDataLookup = (apiConfig) => {
  const [ewcRefData, setEwcRefData] = useState<Array<singleCodeType>>([]);
  const [wasteCodeRefData, setWasteCodeRefData] = useState<
    Array<codeCollection>
  >([]);
  const [recoveryCodeRefData, setRecoveryCodeRefData] = useState<
    Array<singleCodeType>
  >([]);
  const [laboratoryCodeRefData, setLaboratoryCodeRefData] = useState<
    Array<singleCodeType>
  >([]);

  const currentLanguage = i18n.language;

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetch(
          `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/reference-data/ewc-codes`,
          { headers: apiConfig }
        )
          .then((response) => {
            if (response.ok) return response.json();
          })
          .then((data) => {
            if (data !== undefined) {
              setEwcRefData(data);
            }
          });
      } catch (e) {
        console.error(e);
      }

      try {
        await fetch(
          `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/reference-data/waste-codes`,
          { headers: apiConfig }
        )
          .then((response) => {
            if (response.ok) return response.json();
          })
          .then((refdata) => {
            if (refdata !== undefined) {
              setWasteCodeRefData(refdata);
            }
          });
      } catch (e) {
        console.error(e);
      }

      try {
        await fetch(
          `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/reference-data/recovery-codes`,
          { headers: apiConfig }
        )
          .then((response) => {
            if (response.ok) return response.json();
          })
          .then((data) => {
            if (data !== undefined) {
              setRecoveryCodeRefData(data);
            }
          });
      } catch (e) {
        console.error(e);
      }

      try {
        await fetch(
          `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/reference-data/disposal-codes`,
          { headers: apiConfig }
        )
          .then((response) => {
            if (response.ok) return response.json();
          })
          .then((data) => {
            if (data !== undefined) {
              setLaboratoryCodeRefData(data);
            }
          });
      } catch (e) {
        console.error(e);
      }
    };
    fetchData();
  }, []);

  const getWasteCodeDesc = (wasteCode) => {
    let result;
    let foundResult;

    wasteCodeRefData.map((category) => {
      result = category.values.find(({ code }) => code === wasteCode);
      if (result) {
        foundResult = result;
      }
    });
    if (foundResult) {
      return foundResult.value.description[currentLanguage];
    }
  };

  const getEWCDesc = (savedCode) => {
    const result = ewcRefData.find(({ code }) => code === savedCode);
    if (result) {
      return result.value.description[currentLanguage];
    }
  };
  const getRecoveryCodeDesc = (savedCode) => {
    const result = recoveryCodeRefData.find(({ code }) => code === savedCode);
    if (result) {
      return result.value.description[currentLanguage];
    }
  };
  const getLaboratoryCodeDesc = (savedCode) => {
    const result = laboratoryCodeRefData.find(({ code }) => code === savedCode);
    if (result) {
      return result.value.description[currentLanguage];
    }
  };

  return (type, code) => {
    let description = '';

    if (type === 'EWC') {
      description = getEWCDesc(code);
    }

    if (type === 'WasteCode') {
      description = getWasteCodeDesc(code);
    }

    if (type === 'InterimSite' || type === 'RecoveryFacility') {
      description = getRecoveryCodeDesc(code);
    }

    if (type === 'Laboratory') {
      description = getLaboratoryCodeDesc(code);
    }

    return description;
  };
};

export default useRefDataLookup;
