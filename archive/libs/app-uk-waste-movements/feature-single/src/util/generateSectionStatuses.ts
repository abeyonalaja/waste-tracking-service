import { UkwmDraft } from '@wts/api/waste-tracking-gateway';

interface SectionStatus {
  overall: 'Complete' | 'Incomplete';
  checkYourAnswers: 'NotStarted' | 'CannotStart' | 'Complete';
}

interface SectionStatuses {
  producer: SectionStatus;
  carrier: SectionStatus;
  receiver: SectionStatus;
}

export function generateSectionStatuses(draft: UkwmDraft): SectionStatuses {
  // Producer and Collection
  let producerCheckYourAnswers: 'NotStarted' | 'CannotStart' | 'Complete';
  let producerOverall: 'Complete' | 'Incomplete' = 'Incomplete';

  const producerTasksAreComplete =
    draft.producerAndCollection.producer.contact.status === 'Complete' &&
    draft.producerAndCollection.producer.address.status === 'Complete' &&
    draft.producerAndCollection.producer.sicCodes.status === 'Complete' &&
    draft.producerAndCollection.wasteCollection.address.status === 'Complete' &&
    draft.producerAndCollection.wasteCollection.wasteSource.status ===
      'Complete';

  if (
    producerTasksAreComplete &&
    draft.producerAndCollection.confirmation.status === 'Complete'
  ) {
    producerCheckYourAnswers = 'Complete';
    producerOverall = 'Complete';
  } else if (producerTasksAreComplete) {
    producerCheckYourAnswers = 'NotStarted';
  } else {
    producerCheckYourAnswers = 'CannotStart';
  }

  // Carrier
  const carrierCheckYourAnswers: 'NotStarted' | 'CannotStart' | 'Complete' =
    draft.carrier.address.status === 'Complete' &&
    draft.carrier.contact.status === 'Complete' &&
    draft.carrier.modeOfTransport.status === 'Complete'
      ? 'NotStarted'
      : 'CannotStart';

  const carrierOverall = 'Incomplete';

  const receiverCheckYourAnswers: 'NotStarted' | 'CannotStart' | 'Complete' =
    draft.receiver.address.status === 'Complete' &&
    draft.receiver.contact.status === 'Complete' &&
    draft.receiver.permitDetails.status === 'Complete'
      ? 'NotStarted'
      : 'CannotStart';

  const receiverOverall = 'Incomplete';

  return {
    producer: {
      overall: producerOverall,
      checkYourAnswers: producerCheckYourAnswers,
    },
    carrier: {
      overall: carrierOverall,
      checkYourAnswers: carrierCheckYourAnswers,
    },
    receiver: {
      overall: receiverOverall,
      checkYourAnswers: receiverCheckYourAnswers,
    },
  };
}
