import { faker } from '@faker-js/faker';
import { expect, jest } from '@jest/globals';
import winston from 'winston';
import SubmissionController from './submission-controller';
import { DaprReferenceDataClient } from '@wts/client/reference-data';
import { validation } from '../model';

jest.mock('winston', () => ({
  Logger: jest.fn().mockImplementation(() => ({
    error: jest.fn(),
  })),
}));

const mockClient = {};

describe(SubmissionController, () => {
  const subject = new SubmissionController(
    mockClient as unknown as DaprReferenceDataClient,
    new winston.Logger()
  );

  beforeEach(() => {});

  describe('validateSubmissions', () => {
    it('passes submission validation', async () => {
      const accountId = faker.datatype.uuid();

      const response = await subject.validateSubmissions({
        accountId: accountId,
        values: [
          {
            reference: 'testRef',
            producerAddressLine1: '123 Real Street',
            producerAddressLine2: '',
            producerContactName: 'John Smith',
            producerCountry: 'England',
            producerEmail: 'john.smith@john.smith',
            producerOrganisationName: 'Test organization',
            producerPhone: '0044140000000',
            producerPostcode: 'ABC 123',
            producerSicCode: '123456',
            producerTownCity: 'London',
          },
        ],
      });

      expect(response.success).toBe(true);
      if (!response.success) {
        return;
      }

      expect(response.value).toEqual({
        valid: true,
        accountId: accountId,
        values: [
          {
            producer: {
              reference: 'testRef',
              sicCode: '123456',
              address: {
                addressLine1: '123 Real Street',
                addressLine2: undefined,
                country: 'England',
                postcode: 'ABC 123',
                townCity: 'London',
              },
              contact: {
                email: 'john.smith@john.smith',
                name: 'John Smith',
                organisationName: 'Test organization',
                phone: '0044140000000',
              },
            },
            wasteTypeDetails: [],
          },
        ],
      });
    });

    it('fails submission validation on all sections', async () => {
      const accountId = faker.datatype.uuid();

      const response = await subject.validateSubmissions({
        accountId: accountId,
        values: [
          {
            reference: '@!"?',
            producerAddressLine1: '     ',
            producerContactName: '     ',
            producerCountry: '     ',
            producerEmail: 'not_an_email',
            producerOrganisationName: '     ',
            producerPhone: '+123567578',
            producerPostcode: '     ',
            producerSicCode: '     ',
            producerTownCity: '     ',
          },
        ],
      });

      expect(response.success).toBe(true);
      if (!response.success) {
        return;
      }

      expect(response.value).toEqual({
        valid: false,
        accountId: accountId,
        values: [
          {
            index: 3,
            fieldFormatErrors: [
              {
                field: 'Reference',
                message:
                  validation.ProducerValidationErrorMessages.invalidReference,
              },
              {
                field: 'Producer organisation name',
                message:
                  validation.ProducerValidationErrorMessages
                    .emptyOrganisationName,
              },
              {
                field: 'Producer address line 1',
                message:
                  validation.ProducerValidationErrorMessages.emptyAddressLine1,
              },
              {
                field: 'Producer town or city',
                message:
                  validation.ProducerValidationErrorMessages.emptyTownOrCity,
              },
              {
                field: 'Producer country',
                message:
                  validation.ProducerValidationErrorMessages.emptyCountry,
              },
              {
                field: 'Producer postcode',
                message:
                  validation.ProducerValidationErrorMessages.emptyPostcode,
              },
              {
                field: 'Producer contact name',
                message:
                  validation.ProducerValidationErrorMessages
                    .emptyContactFullName,
              },
              {
                field: 'Producer contact phone number',
                message:
                  validation.ProducerValidationErrorMessages.invalidPhone,
              },
              {
                field: 'Producer contact email address',
                message:
                  validation.ProducerValidationErrorMessages.invalidEmail,
              },
              {
                field: 'Producer Standard Industrial Classification (SIC) code',
                message:
                  validation.ProducerValidationErrorMessages.invalidSicCode,
              },
            ],
            invalidStructureErrors: [],
          },
        ],
      });
    });
  });
});
