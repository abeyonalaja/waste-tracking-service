const formatEwcCode = (ewcCode: string) => {
  // Converts 000000 to 00 00 00
  return ewcCode.match(/.{1,2}/g).join(' ');
};

export default formatEwcCode;
