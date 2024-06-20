export default interface DatabaseOperation {
  insert(entityName: string, data: unknown): Promise<unknown>;
  update(entityName: string, filter: object, data: unknown): Promise<unknown>;
  selectOne(entityName: string, filter: object): Promise<unknown | null>;
  selectAll(entityName: string, filter?: object): Promise<unknown[]>;
  delete(entityName: string, filter: object): Promise<unknown>;
  runCustomQuery(query: string, filter: object): Promise<unknown>;
}
