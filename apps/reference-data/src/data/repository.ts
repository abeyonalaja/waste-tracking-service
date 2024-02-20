export interface ReferenceDataRepository {
  getList<T>(id: string): Promise<T[]>;
  saveList<T>(id: string, values: T[]): Promise<void>;
}
