import { SubmittedPageFormData } from '../components/SubmittedFilters/SubmittedFilters';
import { UkwmSubmissionReference } from '@wts/api/waste-tracking-gateway';
import FuzzySearch from 'fuzzy-search';

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
      return Number(submission.collectionDate.month) === Number(formData.month);
    });
  }

  if (formData.year) {
    filteredSubmissions = filteredSubmissions.filter((submission) => {
      return Number(submission.collectionDate.year) === Number(formData.year);
    });
  }

  if (formData.ewcCode) {
    filteredSubmissions = filteredSubmissions.filter((submission) => {
      return submission.ewcCodes.includes(formData.ewcCode.trim());
    });
  }

  if (formData.producerName) {
    const searcher = new FuzzySearch(submissions, ['producerName'], {
      caseSensitive: false,
    });

    const result = searcher.search(formData.producerName.trim());

    return result;
  }

  return filteredSubmissions;
}
