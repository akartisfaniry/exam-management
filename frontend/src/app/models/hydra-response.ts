export interface HydraResponse<T> {
  items: T[]; // hydra:member
  totalItems: number; // hydra:totalItems
  context: string; // @context
  id: string; // @id
  type: string; // @type
}
