And(/^I complete recovery facility address page$/) do
  RecoveryFacilityAddressPage.new.enter_name('first_recovery_facility')
  RecoveryFacilityAddressPage.new.enter_address('first_recovery_facility')
  RecoveryFacilityAddressPage.new.enter_country('first_recovery_facility')
end

And(/^I complete recovery facility contact details$/) do
  RecoveryFacilityContactDetailsPage.new.enter_full_name('first_recovery_facility')
  RecoveryFacilityContactDetailsPage.new.enter_email('first_recovery_facility')
  RecoveryFacilityContactDetailsPage.new.enter_phone_number('first_recovery_facility')
  RecoveryFacilityContactDetailsPage.new.enter_fax_number('first_recovery_facility')
end

When(/^I select first recovery code from the recovery facility$/) do
  RecoveryCodePage.new.select_first_option
end

And(/^I click the Recovery facilities page link$/) do
  click_link 'Recovery facilities page'
end

Then(/^I should see recovery facility address page correctly translated$/) do
  RecoveryFacilityAddressPage.new.check_page_translation
end

Then(/^I should see recovery facility contact details page correctly translated$/) do
  RecoveryFacilityContactDetailsPage.new.check_page_translation
end

Then(/^I should see recovery code page correctly translated$/) do
  RecoveryCodePage.new.check_page_translation
end

Then(/^I should see chosen facility page correctly translated$/) do
  ChosenFacilitiesPage.new.check_translation
end

Then(/^I should first recovery title is displayed with only change link$/) do
  expect(ChosenFacilitiesPage.new).to have_first_recovery_facility_title 'Recovery facility'
  expect(ChosenFacilitiesPage.new).to have_link 'Change'
  expect(ChosenFacilitiesPage.new).not_to have_link 'Remove'
end

And(/^I complete the "([^"]*)" recovery facility$/) do |recovery_facility|
  recovery_facility += '_recovery_facility'
  RecoveryFacilityAddressPage.new.enter_name(recovery_facility)
  RecoveryFacilityAddressPage.new.enter_address(recovery_facility)
  RecoveryFacilityAddressPage.new.enter_country(recovery_facility)
  RecoveryFacilityAddressPage.new.save_and_continue
  RecoveryFacilityContactDetailsPage.new.enter_full_name(recovery_facility)
  RecoveryFacilityContactDetailsPage.new.enter_email(recovery_facility)
  RecoveryFacilityContactDetailsPage.new.enter_phone_number(recovery_facility)
  RecoveryFacilityContactDetailsPage.new.enter_fax_number(recovery_facility)
  RecoveryFacilityContactDetailsPage.new.save_and_continue
  RecoveryCodePage.new.select_first_option
  RecoveryCodePage.new.save_and_continue
end

Then(/^I should see max recovery facility text correctly translated$/) do
  ChosenFacilitiesPage.new.max_facility_translation
end

And(/^I should see previously entered recovery facility details pre\-populated$/) do
  expect(RecoveryFacilityAddressPage.new).to have_name TestStatus.test_status(:first_recovery_facility_name)
  expect(RecoveryFacilityAddressPage.new).to have_address TestStatus.test_status(:first_recovery_facility_address)
  expect(RecoveryFacilityAddressPage.new).to have_country TestStatus.test_status(:first_recovery_facility_country)
end

And(/^I should see first recovery facility details$/) do
  expect(ChosenFacilitiesPage.new.first_recovery_facility_name_tags[0].text).to eq 'Facility name'
  expect(ChosenFacilitiesPage.new.first_recovery_facility_name_tags[1].text).to eq 'Country'
  expect(ChosenFacilitiesPage.new.first_recovery_facility_name_tags[2].text).to eq 'Recovery code'
  expect(ChosenFacilitiesPage.new.first_recovery_facility_values[0].text).to eq TestStatus.test_status(:first_recovery_facility_name)
  expect(ChosenFacilitiesPage.new.first_recovery_facility_values[1].text).to eq TestStatus.test_status(:first_recovery_facility_country)
  expect(ChosenFacilitiesPage.new.first_recovery_facility_values[2].text).to eq TestStatus.test_status(:first_recovery_facility_code)
end

And(/^I should see second recovery facility details$/) do
  expect(ChosenFacilitiesPage.new.second_recovery_facility_name_tags[0].text).to eq 'Facility name'
  expect(ChosenFacilitiesPage.new.second_recovery_facility_name_tags[1].text).to eq 'Country'
  expect(ChosenFacilitiesPage.new.second_recovery_facility_name_tags[2].text).to eq 'Recovery code'
  expect(ChosenFacilitiesPage.new.second_recovery_facility_values[0].text).to eq TestStatus.test_status(:second_recovery_facility_name)
  expect(ChosenFacilitiesPage.new.second_recovery_facility_values[1].text).to eq TestStatus.test_status(:second_recovery_facility_country)
  expect(ChosenFacilitiesPage.new.second_recovery_facility_values[2].text).to eq TestStatus.test_status(:first_recovery_facility_code)
end

And(/^I should see both change and remove recovery facility$/) do
  expect(ChosenFacilitiesPage.new.first_facility_change_and_remove_link[0].text.gsub(/\n(.*)/, '')).to eq 'Change'
  expect(ChosenFacilitiesPage.new.first_facility_change_and_remove_link[1].text.gsub(/\n(.*)/, '')).to eq 'Remove'
  expect(ChosenFacilitiesPage.new.second_facility_change_and_remove_link[0].text.gsub(/\n(.*)/, '')).to eq 'Change'
  expect(ChosenFacilitiesPage.new.second_facility_change_and_remove_link[1].text.gsub(/\n(.*)/, '')).to eq 'Remove'
end

When(/^I update the recovery facility country$/) do
  RecoveryFacilityAddressPage.new.update_country('update_country_recovery_facility')
end

Then(/^I should see previously entered recovery contact details pre\-populated$/) do
  expect(RecoveryFacilityContactDetailsPage.new).to have_full_name TestStatus.test_status(:first_recovery_facility_full_name)
  expect(RecoveryFacilityContactDetailsPage.new).to have_email TestStatus.test_status(:first_recovery_facility_email)
  expect(RecoveryFacilityContactDetailsPage.new).to have_phone_number TestStatus.test_status(:first_recovery_facility_phone_number)
  expect(RecoveryFacilityContactDetailsPage.new).to have_fax TestStatus.test_status(:first_recovery_facility_fax_number)
end

Then(/^I should see previously entered recovery code details pre\-populated$/) do
  expect(RecoveryFacilityContactDetailsPage.new).to have_recovery_code TestStatus.test_status(:first_recovery_facility_code)
end

Then(/^I should see updated recovery country$/) do
  expect(ChosenFacilitiesPage.new.first_recovery_facility_values[1].text).to eq 'WALES'
end

Then(/^I should see remove recovery facility details page displayed$/) do
  expect(self).to have_css 'h1', text: "Are you sure you want to remove #{TestStatus.test_status(:second_recovery_facility_name)}?", exact_text: true
end

Then(/^I should see "([^"]*)" error message displayed$/) do |error_message|
  expect(page).to have_text error_message
end

Then(/^the chosen facility page is displayed$/) do
  expect(self).to have_css 'h1', text: 'Your chosen facility', exact_text: true
end
