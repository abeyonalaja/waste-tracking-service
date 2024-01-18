export type Method = Readonly<{
  name: string;
  httpVerb: 'GET' | 'PUT' | 'POST' | 'DELETE';
}>;

export type AccountIdRequest = { accountId: string };
export type IdRequest = { id: string };
export type OrderRequest = { order: 'ASC' | 'DESC' };

export type SectionSummary = {
  status: 'CannotStart' | 'NotStarted' | 'Started' | 'Complete';
};

export type Handler<Request, Response> = (
  request: Request
) => Promise<Response>;
