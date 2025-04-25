And(/^I complete Waste producer and collection details subsection$/) do
  UkmProducerCollectionDetailsController.complete
end

And(/^I should see Producer address correctly displayed$/) do
  expect(CheckYourAnswersPage.new.producer_address_label).to eq 'Producer address'
  expect(CheckYourAnswersPage.new.producer_address1_value).to eq 'Ashlyn'
  expect(CheckYourAnswersPage.new.producer_address2_value).to eq 'Luton Road, Markyate'
  expect(CheckYourAnswersPage.new.producer_town_value).to eq 'St. Albans'
  expect(CheckYourAnswersPage.new.producer_postcode_value).to eq 'AL3 8QE'
  expect(CheckYourAnswersPage.new.producer_country_value).to eq 'England'

  expect(CheckYourAnswersPage.new.org_name_label).to eq 'Organisation name'
  expect(CheckYourAnswersPage.new.org_name_value).to eq TestStatus.test_status(:org_name)
  expect(CheckYourAnswersPage.new.contact_name_label).to eq 'Contact full name'
  expect(CheckYourAnswersPage.new.contact_name_value).to eq TestStatus.test_status(:contact_person)
  expect(CheckYourAnswersPage.new.email_label).to eq 'Email address'
  expect(CheckYourAnswersPage.new.email_value).to eq TestStatus.test_status(:email)
  expect(CheckYourAnswersPage.new.phone_number_label).to eq 'Phone number'
  expect(CheckYourAnswersPage.new.phone_number_value).to eq TestStatus.test_status(:phone_number)
  expect(CheckYourAnswersPage.new.fax_label).to eq 'Fax number (optional)'
  expect(CheckYourAnswersPage.new.fax_value).to eq 'Not provided'

  expect(CheckYourAnswersPage.new.sic_code_label).to eq 'Producer Standard Industry (SIC) code'
  expect(CheckYourAnswersPage.new.sic_code_value).to eq '10120: Processing and preserving of poultry meat'

  expect(CheckYourAnswersPage.new.producer_address_label).to eq 'Producer address'
  expect(CheckYourAnswersPage.new.waste_collection_address_1_value).to eq 'Ashlyn'
  expect(CheckYourAnswersPage.new.waste_collection_address2_value).to eq 'Luton Road, Markyate'
  expect(CheckYourAnswersPage.new.waste_collection_town_value).to eq 'St. Albans'
  expect(CheckYourAnswersPage.new.waste_collection_postcode_value).to eq 'AL3 8QE'
  expect(CheckYourAnswersPage.new.waste_collection_country_value).to eq 'England'

  expect(CheckYourAnswersPage.new.waste_source_label).to eq 'Waste source'
  expect(CheckYourAnswersPage.new.waste_source_value).to eq 'Commercial'
end
