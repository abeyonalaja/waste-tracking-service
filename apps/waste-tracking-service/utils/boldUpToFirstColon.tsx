import React from 'react';

const boldUpToFirstColon = (string: string) => {
  const parts = string.split(':');
  if (parts.length > 1) {
    return (
      <>
        <strong>{parts.shift()}:</strong>
        {parts.join(':')}
      </>
    );
  } else {
    return string;
  }
};

export default boldUpToFirstColon;
