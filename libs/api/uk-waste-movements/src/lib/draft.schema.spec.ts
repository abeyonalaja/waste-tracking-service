import Ajv from 'ajv/dist/jtd';
import { GetDraftResponse } from './draft.dto';
import { getDraftResponse } from './draft.schema';

const ajv = new Ajv();

describe('getDraftResponse', () => {
  const validate = ajv.compile<GetDraftResponse>(getDraftResponse);
  it('is compatible with dto values', () => {
    const value: GetDraftResponse = {
      success: true,
      value: {
        id: '',
        transactionId: '',
        wasteInformation: {
          status: 'NotStarted',
        },
        receiver: {
          status: 'NotStarted',
        },
        producerAndCollection: {
          status: 'NotStarted',
        },
        submissionDeclaration: {
          status: 'NotStarted',
        },
        submissionState: {
          status: 'SubmittedWithActuals',
          timestamp: new Date(),
        },
      },
    };
    expect(validate(value)).toBe(true);
  });

  it('is compatible with dto values,with all statuses complete', () => {
    const value: GetDraftResponse = {
      success: true,
      value: {
        id: '1',
        transactionId: '123',
        wasteInformation: {
          status: 'Complete',
          wasteTypes: [
            {
              ewcCode: '20 03 01',
              wasteDescription: 'Mixed municipal waste',
              physicalForm: 'Solid',
              wasteQuantity: 100,
              quantityUnit: 'Tonne',
              wasteQuantityType: 'ActualData',
              chemicalAndBiologicalComponents: [
                {
                  name: 'Component1',
                  concentration: 50,
                  concentrationUnit: '%',
                },
              ],
              hasHazardousProperties: false,
              containsPops: false,
            },
          ],
          wasteTransportation: {
            numberAndTypeOfContainers: '10 x 20ft containers',
          },
        },
        receiver: {
          status: 'Completed',
          authorizationType: 'Type1',
          environmentalPermitNumber: 'EPN123',
          contact: {
            organisationName: 'Organisation1',
            name: 'Contact1',
            email: 'contact1@example.com',
            phone: '1234567890',
          },
          address: {
            addressLine1: 'Address Line 1',
            townCity: 'City1',
            country: 'Country1',
          },
        },
        producerAndCollection: {
          status: 'Complete',
          producer: {
            reference: 'REF123',
            contact: {
              organisationName: 'Organisation2',
              name: 'Contact2',
              email: 'contact2@example.com',
              phone: '0987654321',
            },
            address: {
              addressLine1: 'Address Line 2',
              townCity: 'City2',
              country: 'Country2',
            },
          },
          wasteCollection: {
            wasteSource: 'Industrial',
            modeOfWasteTransport: 'Road',
            expectedWasteCollectionDate: {
              day: '01',
              month: '01',
              year: '2025',
            },
            address: {
              addressLine1: 'Address Line 3',
              townCity: 'City3',
              country: 'Country3',
            },
          },
        },
        submissionDeclaration: {
          status: 'Complete',
          values: {
            declarationTimestamp: new Date(),
            transactionId: '123',
          },
        },
        submissionState: {
          status: 'SubmittedWithActuals',
          timestamp: new Date(),
        },
      },
    };
    expect(validate(value)).toBe(true);
  });
});
