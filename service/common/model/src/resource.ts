/**
 * Representation of the identity of some resource
 */
export interface Identity<I> {
  readonly id: I;
  readonly version: string;
  readonly created: Date;
  readonly updated: Date;
}

/**
 * Representation of some identified resource
 */
export interface Resource<I, D> {
  readonly identity: Identity<I>;
  readonly data: D;
}
