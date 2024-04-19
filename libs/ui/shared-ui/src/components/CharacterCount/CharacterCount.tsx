'use client';
import { useFormContext } from 'react-hook-form';

type CharacterCountProps = {
  id: string;
  formName: string;
  maxCount: number;
  textAreaRows?: number;
  heading?: string;
  hint?: string;
  showError?: boolean;
  errorText?: string;
  charsLeftPartOne?: string;
  charsLeftPartTwo?: string;
  charsLeftExceeds?: string;
  headingSize?: 'l' | 'm' | 's';
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  testId?: string;
};

export const CharacterCount = ({
  id,
  formName,
  maxCount,
  textAreaRows = 5,
  heading,
  hint,
  showError = false,
  errorText,
  charsLeftPartOne = 'You have',
  charsLeftPartTwo = 'characters remaining',
  charsLeftExceeds = 'characters too many',
  headingSize = 'm',
  headingLevel = 2,
  testId,
}: CharacterCountProps) => {
  const { register, watch } = useFormContext();

  let countText = `${charsLeftPartOne} ${maxCount} ${charsLeftPartTwo}`;
  let isCountExceeding = false;
  if (watch(formName)) {
    isCountExceeding = watch(formName)?.length > maxCount;
    countText = isCountExceeding
      ? `${charsLeftPartOne} ${Math.abs(
          maxCount - watch(formName).length
        )} ${charsLeftExceeds}`
      : `${charsLeftPartOne} ${
          maxCount - watch(formName)?.length
        } ${charsLeftPartTwo}`;
  }
  const HeadingLevel = `h${headingLevel}` as keyof JSX.IntrinsicElements;
  return (
    <div
      className="govuk-character-count"
      data-module="govuk-character-count"
      data-maxlength={maxCount}
      data-testid={testId}
    >
      <div
        className={`govuk-form-group ${
          showError ? 'govuk-form-group--error' : ''
        }`}
      >
        <HeadingLevel className="govuk-label-wrapper">
          <label
            className={`govuk-label govuk-label--${headingSize}`}
            htmlFor={id}
          >
            {heading}
          </label>
        </HeadingLevel>
        <div id={`${id}-hint`} className="govuk-hint">
          {hint}
        </div>
        {showError && (
          <p id="exceeding-characters-error" className="govuk-error-message">
            <span className="govuk-visually-hidden">Error:</span> {errorText}
          </p>
        )}
        <textarea
          className="govuk-textarea govuk-js-character-count"
          id={id}
          aria-describedby={`${id}-info ${id}-hint`}
          rows={textAreaRows}
          {...register(formName)}
        />
      </div>
      <div
        id={`${id}-info`}
        className={`${
          isCountExceeding
            ? 'govuk-error-message'
            : 'govuk-hint govuk-character-count__message'
        }`}
      >
        {countText}
      </div>
    </div>
  );
};
