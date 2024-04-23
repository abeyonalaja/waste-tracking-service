import { Dispatch, SetStateAction } from 'react';

export type SetUploadId = Dispatch<SetStateAction<string | null>>;

export type SetUploadCount = Dispatch<SetStateAction<number | null>>;

export type SetIsSecondForm = Dispatch<SetStateAction<boolean>>;

export type SetValidationResult = Dispatch<SetStateAction<string | null>>;

export type SetFileName = Dispatch<SetStateAction<string | null>>;

export type SetSubmitted = Dispatch<SetStateAction<boolean>>;

export type SetShowCancelPrompt = Dispatch<SetStateAction<boolean>>;

export type SetShowDeclaration = Dispatch<SetStateAction<boolean>>;

export type Transaction = {
  id: string;
  transactionId: string;
  hasEstimates: boolean;
  collectionDate: string;
  wasteCode: string;
  reference: string;
};

export type ValidationErrorsType = {
  file?: string;
};

export type SetValidationErrors = Dispatch<
  SetStateAction<ValidationErrorsType>
>;

export type UploadErrorResponse = {
  error: string;
  message: string;
  statusCode: number;
};
