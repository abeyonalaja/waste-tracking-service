import { faker } from '@faker-js/faker';
import { expect, jest } from '@jest/globals';
import winston from 'winston';
import AssignmentController from './controller';
import { Assignment } from './model';
import { ValidationResult } from './tokens';

jest.mock('winston', () => ({
  Logger: jest.fn().mockImplementation(() => ({
    error: jest.fn(),
  })),
}));

const mockRepository = {
  getAssignment:
    jest.fn<
      (
        content: string,
        dcidSubjectId: string
      ) => Promise<Assignment | undefined>
    >(),
  setAssignment: jest.fn<(value: Assignment) => Promise<void>>(),
};

const mockTokenValidator = {
  validate: jest.fn<(token: string) => Promise<ValidationResult>>(),
};

describe(AssignmentController, () => {
  const subject = new AssignmentController(
    mockRepository,
    mockTokenValidator,
    new winston.Logger()
  );

  beforeEach(() => {
    mockRepository.getAssignment.mockClear();
    mockRepository.setAssignment.mockClear();
    mockTokenValidator.validate.mockClear();
  });

  describe('checkParticipation', () => {
    it('returns participant info if found', async () => {
      const assignment: Assignment = {
        content: 'GLW',
        dcidSubjectId: faker.datatype.uuid(),
        participantId: faker.datatype.uuid(),
      };
      mockRepository.getAssignment.mockResolvedValueOnce(assignment);

      const result = await subject.checkParticipation({
        dcidSubjectId: assignment.dcidSubjectId,
        content: assignment.content,
      });

      expect(mockRepository.getAssignment).toHaveBeenCalledWith(
        assignment.content,
        assignment.dcidSubjectId
      );

      expect(result.success).toBe(true);
      if (!result.success) {
        return;
      }

      expect(result.value.participant).toBe(true);
      if (!result.value.participant) {
        return;
      }

      expect(result.value.participantId).toBe(assignment.participantId);
    });
  });

  it('returns non-assigned if not found', async () => {
    mockRepository.getAssignment.mockResolvedValueOnce(undefined);

    const result = await subject.checkParticipation({
      content: 'GLW',
      dcidSubjectId: faker.datatype.uuid(),
    });

    expect(mockRepository.getAssignment).toHaveBeenCalled();
    expect(result.success).toBe(true);
    if (!result.success) {
      return;
    }

    expect(result.value.participant).toBe(false);
  });

  describe('redeemInvitation', () => {
    it('makes assignment based on valid token', async () => {
      const assignment: Assignment = {
        content: 'GLW',
        dcidSubjectId: faker.datatype.uuid(),
        participantId: faker.datatype.uuid(),
      };
      mockRepository.setAssignment.mockResolvedValueOnce(undefined);
      mockTokenValidator.validate.mockResolvedValueOnce({
        valid: true,
        payload: {
          content: assignment.content,
          participantId: assignment.participantId,
        },
      });

      const result = await subject.redeemInvitation({
        dcidSubjectId: assignment.dcidSubjectId,
        invitationToken: 'YQ==',
      });

      expect(result.success).toBe(true);
      expect(mockTokenValidator.validate).toBeCalledWith('YQ==');
      expect(mockRepository.setAssignment).toHaveBeenCalledWith(assignment);
    });

    it("doesn't attempt assignment based on invalid token", async () => {
      const error = faker.datatype.string(20);
      mockTokenValidator.validate.mockResolvedValueOnce({
        valid: false,
        error,
      });

      const result = await subject.redeemInvitation({
        dcidSubjectId: faker.datatype.uuid(),
        invitationToken: 'YQ==',
      });

      expect(mockTokenValidator.validate).toBeCalledWith('YQ==');
      expect(mockRepository.setAssignment).not.toHaveBeenCalled();
      expect(result.success).toBe(false);
      if (result.success) {
        return;
      }

      expect(result.error.message).toBe(error);
      expect(result.error.statusCode).toBe(400);
    });
  });
});
