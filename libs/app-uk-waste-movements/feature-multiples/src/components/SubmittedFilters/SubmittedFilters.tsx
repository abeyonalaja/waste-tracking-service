'use client';

import { useTranslations } from 'next-intl';
import * as GovUK from '@wts/ui/govuk-react-ui';
import { useState } from 'react';
import { Accordion, AccordionSection } from '@wts/ui/shared-ui/server';

export function SubmittedFilters(): React.ReactNode {
  const t = useTranslations('multiples.manage.submittedTable.filters');
  const [sections, setSections] = useState<{
    [key: string]: boolean;
  }>({
    collectionDate: false,
    ewcCode: false,
    producerName: false,
    wasteMovementId: false,
  });

  function toggleSection(section: string) {
    setSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  }

  return (
    <div>
      <GovUK.Heading level={2} size="m">
        {t('heading')}
      </GovUK.Heading>
      <Accordion
        id="accordion-filters"
        sections={sections}
        setSections={setSections}
      >
        {/* COLLECTION DATE */}
        <AccordionSection
          id="collectionDate"
          title={t('collectionDate.title')}
          sections={sections}
          toggle={toggleSection}
        >
          <p>Collection Date</p>
        </AccordionSection>
        {/* EWC CODE */}
        <AccordionSection
          id="ewcCode"
          title={t('ewcCode.title')}
          sections={sections}
          toggle={toggleSection}
        >
          <p>EWC Code</p>
        </AccordionSection>
        {/* PRODUCER NAME */}
        <AccordionSection
          id="producerName"
          title={t('producerName.title')}
          sections={sections}
          toggle={toggleSection}
        >
          <p>Producer Name</p>
        </AccordionSection>
        {/* WASTE MOVEMENT ID */}
        <AccordionSection
          id="wasteMovementId"
          title={t('wasteMovementId.title')}
          sections={sections}
          toggle={toggleSection}
        >
          <p>Waste Movement ID</p>
        </AccordionSection>
      </Accordion>
    </div>
  );
}
