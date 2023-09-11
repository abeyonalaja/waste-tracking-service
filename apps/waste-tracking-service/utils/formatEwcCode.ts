const formatEwcCode = (ewcCode: string) => {
  return ewcCode.match(/.{1,2}/g).join(' ');
};

export default formatEwcCode;
