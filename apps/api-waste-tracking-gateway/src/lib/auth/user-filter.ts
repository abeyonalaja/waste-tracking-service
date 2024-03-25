type Credential = {
  uniqueReference: string;
  dcidSubjectId: string;
};

export type UserFilter = (credential: Credential) => Promise<boolean>;

export const any: UserFilter = () => Promise.resolve(true);
export const none: UserFilter = () => Promise.resolve(false);

export function or(a: UserFilter, b: UserFilter): UserFilter {
  return async (c) => {
    const [resA, resB] = await Promise.all([a(c), b(c)]);
    return resA || resB;
  };
}

export function uniqueReferences(set: Set<string>): UserFilter {
  return ({ uniqueReference }) => Promise.resolve(set.has(uniqueReference));
}

/**
 * @param set Semicolon-delimited list of unique references.
 */
export function uniqueReferenceString(set: string): UserFilter {
  return uniqueReferences(new Set(set.split(';')));
}
