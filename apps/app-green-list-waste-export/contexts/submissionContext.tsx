import React, { useState } from 'react';

interface ISubmissionContextProps {
  featureFlags: { multiples: boolean; languages: boolean } | null;
  submission: { id; reference } | null;
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
        featureFlags: props.featureFlags,
        submission: currentSubmission,
        setSubmission: setCurrentSubmission,
      }}
    >
      {props.children}
    </SubmissionContext.Provider>
  );
};
