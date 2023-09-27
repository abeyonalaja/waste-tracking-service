import React, { useState } from 'react';

interface ISubmissionContextProps {
  submission: { id; reference };
  setSubmission: (submission) => void;
}

export const SubmissionContext = React.createContext<ISubmissionContextProps>(
  {} as ISubmissionContextProps
);

export const SubmissionContextProvider = (props) => {
  const [currentSubmission, setCurrentSubmission] = useState(null);
  return (
    <SubmissionContext.Provider
      value={{
        submission: currentSubmission,
        setSubmission: setCurrentSubmission,
      }}
    >
      {props.children}
    </SubmissionContext.Provider>
  );
};
