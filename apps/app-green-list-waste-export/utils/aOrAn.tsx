const aOrAn = (firstLetter: string) => {
  if (/[aeiou]/.test(firstLetter.toLowerCase())) return 'an';
  return 'a';
};

export default aOrAn;
