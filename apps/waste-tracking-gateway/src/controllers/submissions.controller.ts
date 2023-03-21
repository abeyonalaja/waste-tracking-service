import { Request, ResponseToolkit } from '@hapi/hapi';
import data from '../db.json';
import fs from 'fs/promises';
import {
  Submission,
  GetSubmissionRequest,
  GetSubmissionResponse,
  CreateSubmissionRequest,
  CreateSubmissionResponse,
  DeleteSubmissionRequest,
  DeleteSubmissionResponse,
  UpdateSubmissionRequest,
  UpdateSubmissionResponse,
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

export function createSubmissionRequest(request: {
  value: Submission;
}): CreateSubmissionRequest {
  return { value: request.value };
}

export function createSubmissionResponse(
  submission: Submission | undefined
): CreateSubmissionResponse {
  return { value: submission };
}

//Create a new submission
export const createSubmission = async (
  request: Request,
  h: ResponseToolkit
) => {
  try {
    const submissionRequest = createSubmissionRequest({
      value: request.payload as Submission,
    });
    const submission = submissionRequest.value;

    // Add the new submission to the data array
    data.push(submission);

    // Write the updated data to the file
    await fs.writeFile('./db.json', JSON.stringify(data, null, 2));

    const submissionResponse = createSubmissionResponse(submission);

    return h.response(submissionResponse).code(201);
  } catch (error) {
    return h.response(error).code(500);
  }
};

export function getSubmissionRequest(data: {
  id: string;
}): GetSubmissionRequest {
  return { id: data.id };
}

export function getSubmissionResponse(
  submission: Submission | undefined
): GetSubmissionResponse {
  return { value: submission };
}

//Get a single submission
export const getSubmission = async (request: Request, h: ResponseToolkit) => {
  try {
    const submissionRequest = getSubmissionRequest({ id: request.params.id });
    const submissionFound = data.find(
      (submission) => submission.id === submissionRequest.id
    );
    const submissionResponse = getSubmissionResponse(submissionFound);
    if (!submissionResponse.value) {
      return h.response().code(404);
    }
    return h.response(submissionResponse).code(200);
  } catch (error) {
    return h.response(error).code(500);
  }
};

export function deleteSubmissionRequest(
  request: Request
): DeleteSubmissionRequest {
  const { id } = request.params;
  return { id };
}

export function deleteSubmissionResponse(
  success: boolean
): DeleteSubmissionResponse {
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
    await fs.writeFile('./db.json', JSON.stringify(data, null, 2));

    const deleteResponse = deleteSubmissionResponse(true);

    return h.response(deleteResponse).code(200);
  } catch (error) {
    return h.response(error).code(500);
  }
};

export function updateSubmissionRequest(
  request: Request
): UpdateSubmissionRequest {
  const { id, value } = request.payload as Submission;
  return { value: { id, value } };
}

export function updateSubmissionResponse(
  submission: Submission
): UpdateSubmissionResponse {
  return { value: submission };
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

    await fs.writeFile('./db.json', JSON.stringify(data, null, 2));

    const submissionResponse = updateSubmissionResponse(updatedSubmission);

    return h.response(submissionResponse).code(200);
  } catch (error) {
    return h.response(error).code(500);
  }
};
