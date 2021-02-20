import { Resource } from '@kinarad-service/model';

/**
 * Shape of the data that makes up a user
 */
export interface UserData {
  readonly displayName: string;
  readonly email: string;
  readonly enabled: boolean;
  readonly status: string;
}

/** A persisted user resource */
export type UserResource = Resource<string, UserData>;
