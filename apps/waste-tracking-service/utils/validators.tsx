export const validateOwnReference: (value?: string) => string | undefined = (value) =>
  value ? undefined : 'Select yes if you want to add a reference';

export const validateReference: (ownReference?: string, reference?: string) => string | undefined = (ownReference, reference) => {
  if (ownReference !== 'yes')
    return

  if (reference === undefined || reference === '')
    return 'Enter a reference ';

  if (reference.length === 1)
    return 'Enter a reference using more than 1 character';

  if (reference.length > 50)
    return 'Enter a reference using 50 character or less';


}

