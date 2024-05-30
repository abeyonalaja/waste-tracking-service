'use client';
import { useFormContext } from 'react-hook-form';

interface CharacterCountProps {
  formName: string;
  maxCount: number;
  testId?: string;
}

export const CharacterCount = ({
  formName,
  maxCount,
  testId,
}: CharacterCountProps): JSX.Element => {
  const { register, watch } = useFormContext();

  let countText = `You have ${maxCount} characters remaining`;

  if (watch(formName)) {
    watch(formName)?.length <= maxCount
      ? (countText = `You have ${
          maxCount - watch(formName)?.length
        } characters remaining`)
      : (countText = `You have ${Math.abs(
          maxCount - watch(formName).length,
        )} characters too many`);
  }

  return (
    <div
      className="govuk-character-count"
      data-module="govuk-character-count"
      data-maxlength="200"
      data-testid={testId}
    >
      <div className="govuk-form-group">
        <h1 className="govuk-label-wrapper">
          <label className="govuk-label govuk-label--l" htmlFor="with-hint">
            Can you provide more detail?
          </label>
        </h1>
        <div id="with-hint-hint" className="govuk-hint">
          Do not include personal or financial information like your National
          Insurance number or credit card details.
        </div>
        <p id="exceeding-characters-error" className="govuk-error-message">
          <span className="govuk-visually-hidden">Error:</span> Job description
          must be {maxCount} characters or less
        </p>
        <textarea
          className="govuk-textarea govuk-js-character-count"
          id="with-hint"
          aria-describedby="with-hint-info with-hint-hint"
          {...register(formName)}
        />
      </div>
      <div
        id="with-hint-info"
        className="govuk-hint govuk-character-count__message"
      >
        {countText}
      </div>
    </div>
  );
};
