type Credential = {
  uniqueReference: string;
};

export type UserFilter = (credential: Credential) => boolean;

export const any: UserFilter = () => true;

export function uniqueReferences(set: Set<string>): UserFilter {
  return ({ uniqueReference }) => set.has(uniqueReference);
}

/**
 * @param set Semicolon-delimited list of unique references.
 */
export function uniqueReferenceString(set: string): UserFilter {
  return uniqueReferences(new Set(set.split(';')));
}
