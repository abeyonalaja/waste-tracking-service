import React, { useState } from 'react';
import { Submission } from '../types/Submission'


interface ISubmissionContextProps {
  submission: Submission;
  setSubmission: (submission: Submission) => void;
}

export const SubmissionContext = React.createContext<ISubmissionContextProps>({} as ISubmissionContextProps);

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
