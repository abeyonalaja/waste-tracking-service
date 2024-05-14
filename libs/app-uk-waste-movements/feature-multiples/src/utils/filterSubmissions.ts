import { SubmittedPageFormData } from '../components/SubmittedTable/SubmittedTable';
import { UkwmSubmissionReference } from '@wts/api/waste-tracking-gateway';

export function filterSubmissions(
  submissions: UkwmSubmissionReference[],
  formData: SubmittedPageFormData
): UkwmSubmissionReference[] {
  let filteredSubmissions = [...submissions];

  if (formData.wasteMovementId) {
    filteredSubmissions = filteredSubmissions.filter((submission) => {
      return submission.wasteMovementId === formData.wasteMovementId.trim();
    });
  }

  if (formData.day) {
    filteredSubmissions = filteredSubmissions.filter((submission) => {
      return Number(submission.collectionDate.day) === Number(formData.day);
    });
  }

  if (formData.month) {
    filteredSubmissions = filteredSubmissions.filter((submission) => {
      return Number(submission.collectionDate.day) === Number(formData.day);
    });
  }

  if (formData.year) {
    filteredSubmissions = filteredSubmissions.filter((submission) => {
      return Number(submission.collectionDate.day) === Number(formData.day);
    });
  }

  if (formData.ewcCode) {
    filteredSubmissions = filteredSubmissions.filter((submission) => {
      return submission.ewcCodes.includes(formData.ewcCode.trim());
    });
  }

  if (formData.producerName) {
    filteredSubmissions = filteredSubmissions.filter((submission) => {
      return submission.producerName === formData.producerName.trim();
    });
  }

  return filteredSubmissions;
}
