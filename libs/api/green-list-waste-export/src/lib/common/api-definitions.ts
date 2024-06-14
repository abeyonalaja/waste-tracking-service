export type Method = Readonly<{
  name: string;
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
