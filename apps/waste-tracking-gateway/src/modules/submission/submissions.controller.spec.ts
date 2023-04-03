import { faker } from '@faker-js/faker';
import { expect, jest } from '@jest/globals';
import { Submission, WasteDescription } from './submission.backend';
import SubmissionController from './submission.controller';

describe(SubmissionController, () => {
  const mockBackend = {
    listSubmissions: jest.fn<() => Promise<Submission[]>>(),
    createSubmission: jest.fn<(reference?: string) => Promise<Submission>>(),
    getSubmissionById:
      jest.fn<(id: string) => Promise<Submission | undefined>>(),
    getWasteDescriptionById:
      jest.fn<
        (submissionId: string) => Promise<WasteDescription | undefined>
      >(),
    setWasteDescriptionById:
      jest.fn<
        (
          submissionId: string,
          wasteDescription: WasteDescription
        ) => Promise<WasteDescription | undefined>
      >(),
  };

  beforeEach(() => {
    mockBackend.listSubmissions.mockClear();
    mockBackend.createSubmission.mockClear();
    mockBackend.getSubmissionById.mockClear();
  });

  const subject = new SubmissionController(mockBackend);

  describe(SubmissionController.prototype.listSubmissions, () => {
    it('Maps values to DTO types', async () => {
      const value: Submission = {
        id: faker.datatype.uuid(),
        reference: faker.datatype.string(10),
        wasteDescription: {
          status: 'Started',
          description: 'Test shipment',
          wasteCode: {
            type: 'AnnexIIIA',
            value: '1101',
          },
        },
        wasteQuantity: { status: 'CannotStart' },
        exporterDetail: { status: 'NotStarted' },
        importerDetail: { status: 'NotStarted' },
        collectionDate: { status: 'NotStarted' },
        carriers: { status: 'NotStarted' },
        ukExitLocation: { status: 'NotStarted' },
        transitCountries: { status: 'NotStarted' },
        recoveryFacilityDetail: { status: 'CannotStart' },
      };

      mockBackend.listSubmissions.mockResolvedValue([value]);

      const result = await subject.listSubmissions();

      expect(mockBackend.listSubmissions).toBeCalledTimes(1);
      expect(result).toEqual([value]);
    });
  });

  describe(SubmissionController.prototype.getSubmission, () => {
    it('Returns undefined if not found', async () => {
      mockBackend.getSubmissionById.mockResolvedValue(undefined);
      const result = await subject.getSubmission(faker.datatype.uuid());
      expect(result).toBeUndefined();
    });

    it('Returns undefined if not found', async () => {
      mockBackend.getSubmissionById.mockResolvedValue(undefined);
      const result = await subject.getSubmission(faker.datatype.uuid());
      expect(result).toBeUndefined();
    });

    it('Maps value to DTO type', async () => {
      const value: Submission = {
        id: faker.datatype.uuid(),
        reference: faker.datatype.string(10),
        wasteDescription: {
          status: 'Started',
          description: 'Test shipment',
          wasteCode: {
            type: 'AnnexIIIA',
            value: '1101',
          },
        },
        wasteQuantity: { status: 'CannotStart' },
        exporterDetail: { status: 'NotStarted' },
        importerDetail: { status: 'NotStarted' },
        collectionDate: { status: 'NotStarted' },
        carriers: { status: 'NotStarted' },
        ukExitLocation: { status: 'NotStarted' },
        transitCountries: { status: 'NotStarted' },
        recoveryFacilityDetail: { status: 'CannotStart' },
      };

      mockBackend.getSubmissionById.mockResolvedValue(value);

      const result = await mockBackend.getSubmissionById(value.id);

      expect(mockBackend.getSubmissionById).toBeCalledWith(value.id);
      expect(result).toBeDefined();
      if (result === undefined) {
        return;
      }

      expect(result).toEqual(value);
    });
  });
});
