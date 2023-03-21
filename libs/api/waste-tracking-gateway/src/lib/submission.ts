export interface Submission {
  id: string;
  value: string;
}

//GET /submissions/{id}
export interface GetSubmissionRequest {
  id: string;
}

export interface GetSubmissionResponse {
  value: Submission | undefined;
}

//POST /submissions
export interface CreateSubmissionRequest {
  value: Submission;
}

export interface CreateSubmissionResponse {
  value: Submission | undefined;
}

//PUT /submissions
export interface UpdateSubmissionRequest {
  value: Submission;
}

export interface UpdateSubmissionResponse {
  value: Submission;
}

//Delete /submissions/{id}
export interface DeleteSubmissionRequest {
  id: string;
}

export interface DeleteSubmissionResponse {
  deleted: boolean;
}
