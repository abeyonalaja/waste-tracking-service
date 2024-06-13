'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { filterSubmissions } from '../../utils';
import type { UkwmSubmissionReference } from '@wts/api/waste-tracking-gateway';
import styles from './SubmittedFilters.module.scss';
import * as GovUK from '@wts/ui/govuk-react-ui';
import { Accordion, AccordionSection } from '@wts/ui/shared-ui/server';

interface SubmittedFiltersProps {
  sortedSubmissions: UkwmSubmissionReference[];
  setFilteredSubmissions: React.Dispatch<
    React.SetStateAction<UkwmSubmissionReference[]>
  >;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

export interface SubmittedPageFormData {
  wasteMovementId: string;
  day: string;
  month: string;
  year: string;
  ewcCode: string;
  producerName: string;
}

export function SubmittedFilters({
  sortedSubmissions,
  setFilteredSubmissions,
  setCurrentPage,
}: SubmittedFiltersProps): JSX.Element {
  const t = useTranslations('multiples.manage.submittedTable.filters');

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<SubmittedPageFormData>({
    mode: 'onSubmit',
    shouldFocusError: false,
  });

  const onSubmit = handleSubmit((formData) => {
    setFilteredSubmissions(filterSubmissions(sortedSubmissions, formData));
    setCurrentPage(1);
    window.scrollTo(0, 0);
  });

  function resetFilters(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault();
    reset();
    setCurrentPage(1);
    setFilteredSubmissions(sortedSubmissions);
    window.scrollTo(0, 0);
  }

  function validateCollectionDate(): boolean {
    const day = watch('day');
    const month = watch('month');
    const year = watch('year');

    if (day || month || year) {
      if (day && month && year) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  }

  const [sections, setSections] = useState<{ [key: string]: boolean }>({
    collectionDate: false,
    ewcCode: false,
    producerName: false,
    wasteMovementId: false,
  });

  function toggleSection(id: string) {
    setSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  }

  return (
    <form>
      <GovUK.Heading level={2} size="m">
        {t('heading')}
      </GovUK.Heading>
      <Accordion
        id="accordion-filters"
        sections={sections}
        setSections={setSections}
      >
        <AccordionSection
          id="collectionDate"
          title={t('collectionDate.title')}
          sections={sections}
          toggle={toggleSection}
        >
          <div
            className={`govuk-form-group ${
              errors.day && 'govuk-form-group--error'
            }`}
          >
            <p className="govuk-hint">{t('collectionDate.hint')}</p>
            <div className="govuk-date-input">
              {errors.day && (
                <p className="govuk-error-message">
                  <span className="govuk-visually-hidden">Error: </span>
                  {t('collectionDate.error')}
                </p>
              )}
              <div className="govuk-date-input__item">
                <div className="govuk-form-group">
                  <label
                    className={`govuk-label govuk-date-input__label`}
                    htmlFor="collection-date-day"
                  >
                    {t('collectionDate.labelOne')}
                  </label>
                  <input
                    className={`govuk-input govuk-date-input__input govuk-input--width-2 ${
                      errors.day && !watch('day') && 'govuk-input--error'
                    }`}
                    inputMode="numeric"
                    maxLength={2}
                    id="collection-date-day"
                    {...register('day', {
                      validate: validateCollectionDate,
                    })}
                  />
                </div>
              </div>
              <div className="govuk-date-input__item">
                <div className="govuk-form-group">
                  <label
                    className="govuk-label govuk-date-input__label"
                    htmlFor="collection-date-month"
                  >
                    {t('collectionDate.labelTwo')}
                  </label>
                  <input
                    className={`govuk-input govuk-date-input__input govuk-input--width-2 ${
                      errors.month && !watch('month') && 'govuk-input--error'
                    }`}
                    inputMode="numeric"
                    maxLength={2}
                    id="collection-date-month"
                    {...register('month', {
                      validate: validateCollectionDate,
                    })}
                  />
                </div>
              </div>
              <div className="govuk-date-input__item">
                <div className="govuk-form-group">
                  <label
                    className="govuk-label govuk-date-input__label"
                    htmlFor="collection-date-year"
                  >
                    {t('collectionDate.labelThree')}
                  </label>
                  <input
                    className={`govuk-input govuk-date-input__input govuk-input--width-4 ${
                      errors.year && !watch('year') && 'govuk-input--error'
                    }`}
                    inputMode="numeric"
                    maxLength={43}
                    id="collection-date-year"
                    {...register('year', {
                      validate: validateCollectionDate,
                    })}
                  />
                </div>
              </div>
            </div>
          </div>
        </AccordionSection>
        <AccordionSection
          id="ewcCode"
          title={t('ewcCode.title')}
          sections={sections}
          toggle={toggleSection}
        >
          <div className="govuk-form-group">
            <div className="govuk-hint">{t('ewcCode.hint')}</div>
            <input
              {...register('ewcCode')}
              type="text"
              className="govuk-input"
              aria-labelledby="ewcCode-label"
            />
          </div>
        </AccordionSection>
        <AccordionSection
          id="producerName"
          title={t('producerName.title')}
          sections={sections}
          toggle={toggleSection}
        >
          <div className="govuk-form-group">
            <div className="govuk-hint">{t('producerName.hint')}</div>
            <input
              {...register('producerName')}
              type="text"
              className="govuk-input"
              aria-labelledby="producerName-label"
            />
          </div>
        </AccordionSection>
        <AccordionSection
          id="wasteMovementId"
          title={t('wasteMovementId.title')}
          sections={sections}
          toggle={toggleSection}
        >
          <div className="govuk-form-group">
            <div className="govuk-hint">{t('wasteMovementId.hint')}</div>
            <input
              {...register('wasteMovementId')}
              type="text"
              className="govuk-input"
              aria-labelledby="wasteMovementId-label"
            />
          </div>
        </AccordionSection>
      </Accordion>
      <div className={styles.buttons}>
        <button className="govuk-button" type="submit" onClick={onSubmit}>
          {t('buttons.apply')}
        </button>
        <button
          className="govuk-button govuk-button--secondary"
          onClick={(e) => resetFilters(e)}
        >
          {t('buttons.reset')}
        </button>
      </div>
    </form>
  );
}
