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

    // Add the new submission to the data array
    data.push(submission);

    // Write the updated data to the file
    await fs.writeFile(
      './apps/waste-tracking-gateway/src/db.json',
      JSON.stringify(data, null, 2)
    );

    const submissionResponse = { created: true };

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
    const { id } = request.params;
    const submissionToUpdateIndex = data.findIndex(
      (submission) => submission.id === id
    );
    if (submissionToUpdateIndex === -1) {
      return h.response().code(404);
    }

    const submissionRequest = updateSubmissionRequest(request);
    const updatedSubmission = submissionRequest.value;

    data[submissionToUpdateIndex] = updatedSubmission;

    await fs.writeFile(
      './apps/waste-tracking-gateway/src/db.json',
      JSON.stringify(data, null, 2)
    );

    const submissionResponse = updateSubmissionResponse(true);

    return h.response(submissionResponse).code(200);
  } catch (error) {
    return h.response(error).code(500);
  }
};
