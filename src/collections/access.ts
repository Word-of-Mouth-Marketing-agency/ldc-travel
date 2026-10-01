import type { CollectionConfig } from "payload";

const signedIn = ({ req }: { req: { user?: unknown } }) => Boolean(req.user);

export const authenticatedCollectionAccess: NonNullable<CollectionConfig["access"]> = {
  create: signedIn,
  read: signedIn,
  update: signedIn,
  delete: signedIn,
};

export const authenticatedWriteAccess = {
  create: signedIn,
  update: signedIn,
  delete: signedIn,
};
