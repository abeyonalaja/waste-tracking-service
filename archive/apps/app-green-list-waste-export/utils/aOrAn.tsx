const aOrAn = (firstLetter: string): string => {
  if (/[aeiou]/.test(firstLetter.toLowerCase())) return 'an';
  return 'a';
};

export default aOrAn;
