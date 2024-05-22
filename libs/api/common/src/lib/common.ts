export type Method = Readonly<{
  name: string;
  httpVerb: 'GET' | 'PUT' | 'POST' | 'DELETE';
}>;

export interface AccountIdRequest {
  accountId: string;
}
export interface IdRequest {
  id: string;
}
export interface OrderRequest {
  order: 'ASC' | 'DESC';
}

export interface SectionSummary {
  status: 'CannotStart' | 'NotStarted' | 'Started' | 'Complete';
}

export type Handler<Request, Response> = (
  request: Request
) => Promise<Response>;
