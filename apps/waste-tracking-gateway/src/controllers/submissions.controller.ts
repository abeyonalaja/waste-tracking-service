import { Request, ResponseToolkit } from '@hapi/hapi';
import data from '../db.json';
import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
import {
  Submission,
  GetSubmissionByIdRequest,
  GetSubmissionByIdResponse,
  GetSubmissionByReferenceRequest,
  GetSubmissionByReferenceResponse,
  DeleteSubmissionRequest,
  DeleteSubmissionResponse,
  UpdateSubmissionRequest,
  UpdateSubmissionResponse,
  SectionStatus,
  SubmissionRequestPayload,
} from '@wts/api/waste-tracking-gateway';

//List all submissions
export const listSubmissions = async (request: Request, h: ResponseToolkit) => {
  try {
    const submissions = await data;
    return h.response(submissions).code(200);
  } catch (error) {
    return h.response(error).code(500);
  }
};

function createBaseSubmission() {
  const submission: Submission = {
    id: uuidv4(),
    accountName: null,
    reference: null,
    wasteDescriptionStatus: SectionStatus.NotStarted,
    wasteDescriptionData: {},
    quantityOfWasteStatus: SectionStatus.CannotStart,
    quantityOfWasteData: {},
    exporterImporterStatus: SectionStatus.NotStarted,
    exporterDetailsStatus: SectionStatus.NotStarted,
    exporterData: {},
    importerDetailsStatus: SectionStatus.NotStarted,
    importerData: {},
    journeyofWasteStatus: SectionStatus.NotStarted,
    collectionDateStatus: SectionStatus.NotStarted,
    collectionDateData: {},
    wasteCarriersStatus: SectionStatus.NotStarted,
    wasteCarriersData: {},
    wasteCollectionDetailsStatus: SectionStatus.NotStarted,
    wasteCollectionDetailsData: {},
    locationWasteLeavesUKStatus: SectionStatus.NotStarted,
    locationWasteLeavesUKStatusData: SectionStatus.NotStarted,
    treatmentOfWasteStatus: SectionStatus.NotStarted,
    recoveryFacilityStatus: SectionStatus.CannotStart,
    recoveryFacilityData: {},
  };
  return submission;
}

//Create a new submission
export const createSubmission = async (
  request: Request,
  h: ResponseToolkit
) => {
  try {
    const submission = createBaseSubmission();
    const submissionRequestPayload =
      request.payload as SubmissionRequestPayload;

    if (submissionRequestPayload.reference?.length > 50) {
      return h.response().code(400);
    }

    if (submissionRequestPayload?.reference) {
      submission.reference = submissionRequestPayload.reference;
    }
    // Add the new submission to the data array
    data.push(submission);

    // Write the updated data to the file
    await fs.writeFile(
      './apps/waste-tracking-gateway/src/db.json',
      JSON.stringify(data, null, 2)
    );

    const submissionResponse = { created: true, submissionId: submission.id };

    return h.response(submissionResponse).code(201);
  } catch (error) {
    return h.response(error).code(500);
  }
};

function getSubmissionByIdRequest(data: {
  id: string;
}): GetSubmissionByIdRequest {
  return { id: data.id };
}

function getSubmissionByIdResponse(
  submission: Submission
): GetSubmissionByIdResponse {
  return { result: submission };
}

//Get the submission with matching id
export const getSubmissionById = async (
  request: Request,
  h: ResponseToolkit
) => {
  try {
    const submissionRequest = getSubmissionByIdRequest({
      id: request.params.id,
    });
    const submissionResponse = getSubmissionByIdResponse(
      data.find((submission) => submission.id === submissionRequest.id)
    );
    if (!submissionResponse.result) {
      return h.response().code(404);
    }
    return h.response(submissionResponse).code(200);
  } catch (error) {
    return h.response(error).code(500);
  }
};

function getSubmissionByReferenceRequest(
  request: Request
): GetSubmissionByReferenceRequest {
  const { reference } = request.params;
  return { reference };
}

function getSubmissionByReferenceResponse(
  submissions: Submission[]
): GetSubmissionByReferenceResponse {
  return { results: submissions };
}

//Get all submissions with matching references
export const getSubmissionByReference = async (
  request: Request,
  h: ResponseToolkit
) => {
  try {
    const submissionRequest = getSubmissionByReferenceRequest(request);
    const submissionResponse = getSubmissionByReferenceResponse(
      data.filter(
        (submission) => submission.reference === submissionRequest.reference
      )
    );
    if (submissionResponse.results.length === 0) {
      return h.response().code(404);
    }
    return h.response(submissionResponse).code(200);
  } catch (error) {
    return h.response(error).code(500);
  }
};

function deleteSubmissionRequest(request: Request): DeleteSubmissionRequest {
  const { id } = request.params;
  return { id };
}

function deleteSubmissionResponse(success: boolean): DeleteSubmissionResponse {
  return { deleted: success };
}

//Delete a submission
export const deleteSubmission = async (
  request: Request,
  h: ResponseToolkit
) => {
  try {
    const deleteRequest = deleteSubmissionRequest(request);
    const submissionToDelete = data.find(
      (submission) => submission.id === deleteRequest.id
    );
    if (!submissionToDelete) {
      return h.response().code(404);
    }

    const indexToDelete = data.indexOf(submissionToDelete);
    data.splice(indexToDelete, 1);

    // Write the updated data to the file
    await fs.writeFile(
      './apps/waste-tracking-gateway/src/db.json',
      JSON.stringify(data, null, 2)
    );

    const deleteResponse = deleteSubmissionResponse(true);

    return h.response(deleteResponse).code(200);
  } catch (error) {
    return h.response(error).code(500);
  }
};

function updateSubmissionRequest(request: Request): UpdateSubmissionRequest {
  const submission = request.payload as Submission;
  return { value: submission };
}

function updateSubmissionResponse(success: boolean): UpdateSubmissionResponse {
  return { updated: success };
}

//Update a submission
export const updateSubmission = async (
  request: Request,
  h: ResponseToolkit
) => {
  try {
    // Find the submission to update
    const { id } = request.params;
    const submissionToUpdateIndex = data.findIndex(
      (submission) => submission.id === id
    );
    if (submissionToUpdateIndex === -1) {
      return h.response().code(404);
    }

    if (!request.payload) {
      return h.response().code(400);
    }

    // Get the existing submission object
    const existingSubmission = data[submissionToUpdateIndex];
    const submissionRequest = updateSubmissionRequest(request);

    //Filter payload object with submission attributes
    const filteredSubmissionRequest = Object.fromEntries(
      Object.entries(submissionRequest.value).filter(
        ([key]) =>
          key.includes('accountName') ||
          key.includes('reference') ||
          key.includes('wasteDescriptionStatus') ||
          key.includes('wasteDescriptionData') ||
          key.includes('quantityOfWasteStatus') ||
          key.includes('quantityOfWasteData') ||
          key.includes('exporterImporterStatus') ||
          key.includes('exporterDetailsStatus') ||
          key.includes('exporterData') ||
          key.includes('importerDetailsStatus') ||
          key.includes('importerData') ||
          key.includes('journeyofWasteStatus') ||
          key.includes('collectionDateStatus') ||
          key.includes('collectionDateData') ||
          key.includes('wasteCarriersStatus') ||
          key.includes('wasteCarriersData') ||
          key.includes('wasteCollectionDetailsStatus') ||
          key.includes('wasteCollectionDetailsData') ||
          key.includes('locationWasteLeavesUKStatus') ||
          key.includes('locationWasteLeavesUKStatusData') ||
          key.includes('treatmentOfWasteStatus') ||
          key.includes('recoveryFacilityStatus') ||
          key.includes('recoveryFacilityData')
      )
    );

    if (
      Object.keys(filteredSubmissionRequest).length === 0 ||
      submissionRequest.value.reference?.length > 50 ||
      submissionRequest.value.accountName?.length > 50
    ) {
      return h.response().code(400);
    }
    // Merge the existing submission with the updated attributes
    const updatedSubmission = {
      ...existingSubmission,
      ...filteredSubmissionRequest,
    };

    // Update the data array with the updated submission
    data[submissionToUpdateIndex] = updatedSubmission;

    // Write the updated data array to the JSON file
    await fs.writeFile(
      './apps/waste-tracking-gateway/src/db.json',
      JSON.stringify(data, null, 2)
    );

    // Send a success response
    const submissionResponse = updateSubmissionResponse(true);
    return h.response(submissionResponse).code(200);
  } catch (error) {
    return h.response(error).code(500);
  }
};
