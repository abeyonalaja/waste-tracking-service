import React from 'react';

const boldUpToFirstColon = (string: string): string | React.ReactNode => {
  if (string === undefined) return;
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
