export const validateOwnReference: (value?: string) => string | undefined = (value) =>
  value ? undefined : 'Select yes if you want to add a reference';

export const validateReference: (ownReference?: string, reference?: string) => string | null = (ownReference, reference) => {
  if (ownReference !== 'yes')
    return

  if (reference === null || reference === '')
    return 'Enter a reference ';

  if (reference.length === 1)
    return 'Enter a reference using more than 1 character';

  if (reference.length > 50)
    return 'Enter a reference using 50 character or less';

  const regex = new RegExp('^[a-zA-Z0-9\\-\\/]{1,50}$');
  if (!regex.test(reference))
    return 'The reference must only include letters a to z, numbers, hyphens and forward slashes';

}

