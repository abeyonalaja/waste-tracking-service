And(/^I complete the Interim site address page$/) do
  InterimSiteAddressPage.new.enter_name 'interim_site'
  InterimSiteAddressPage.new.enter_address 'interim_site'
  InterimSiteAddressPage.new.enter_country 'interim_site'
end

And(/^I complete Interim site contact details page$/) do
  InterimSiteContactDetailsPage.new.enter_full_name 'interim_site_contact'
  InterimSiteContactDetailsPage.new.enter_email 'interim_site_contact'
  InterimSiteContactDetailsPage.new.enter_phone_number 'interim_site_contact'
end

And(/^I should see interim site address details pre\-populated$/) do
  expect(InterimSiteAddressPage.new).to have_name TestStatus.test_status(:interim_site_name)
  expect(InterimSiteAddressPage.new).to have_address TestStatus.test_status(:interim_site_address)
  expect(InterimSiteAddressPage.new).to have_country TestStatus.test_status(:interim_site_country)
end

Then(/^I should see interim site contact details pre\-populated$/) do
  expect(InterimSiteContactDetailsPage.new).to have_full_name TestStatus.test_status(:interim_site_contact_full_name)
  expect(InterimSiteContactDetailsPage.new).to have_email TestStatus.test_status(:interim_site_contact_email)
  expect(InterimSiteContactDetailsPage.new).to have_phone_number TestStatus.test_status(:interim_site_contact_phone_number)
end

Then(/^I should see previously selected interim recovery code$/) do
  expect(InterimSiteRecoveryCodePage.new.option_checked?('R12')).to eq(true)
end

And(/^I should see Interim address page correctly translated$/) do
  InterimSiteAddressPage.new.check_page_translation
end

And(/^I should see Interim site contact page correctly translated$/) do
  InterimSiteContactDetailsPage.new.check_page_translation
end

And(/^I see Confirmation interim site page translated$/) do
  ConfirmationInterimSitePage.new.check_page_translation
end

Then(/^I see interim site description translated$/) do
  ConfirmationInterimSitePage.new.check_description_translation
end

And(/^I click description link$/) do
  page.find(class: 'src__StyledSummary-sc-273hbe-1 gFIgVF').click
end
