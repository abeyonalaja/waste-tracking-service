And(/^I complete recovery facility address page$/) do
  RecoveryFacilityAddressPage.new.enter_name('1st_recovery_facility')
  RecoveryFacilityAddressPage.new.enter_address('1st_recovery_facility')
  RecoveryFacilityAddressPage.new.select_recovery_facility_country('1st_recovery_facility')
end

And(/^I complete recovery facility contact details$/) do
  RecoveryFacilityContactDetailsPage.new.enter_full_name('1st_recovery_facility')
  RecoveryFacilityContactDetailsPage.new.enter_email('1st_recovery_facility')
  RecoveryFacilityContactDetailsPage.new.enter_phone_number('1st_recovery_facility')
  RecoveryFacilityContactDetailsPage.new.enter_fax_number('1st_recovery_facility')
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
  expect(ChosenFacilitiesPage.new).to have_first_recovery_facility_title Translations.value 'exportJourney.recoveryFacilities.cardTitle'
  expect(ChosenFacilitiesPage.new).to have_link Translations.value 'actions.change'
  expect(ChosenFacilitiesPage.new).not_to have_link Translations.value 'actions.remove'
end

And(/^I complete the "([^"]*)" recovery facility$/) do |recovery_facility|
  recovery_facility += '_recovery_facility'
  RecoveryFacilityAddressPage.new.enter_name(recovery_facility)
  RecoveryFacilityAddressPage.new.enter_address(recovery_facility)
  RecoveryFacilityAddressPage.new.select_recovery_facility_country(recovery_facility)
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
  expect(RecoveryFacilityAddressPage.new).to have_name TestStatus.test_status('1st_recovery_facility_name'.to_sym)
  expect(RecoveryFacilityAddressPage.new).to have_address TestStatus.test_status('1st_recovery_facility_address'.to_sym)
  expect(RecoveryFacilityAddressPage.new).to have_country TestStatus.test_status('1st_recovery_facility_country'.to_sym)
end

And(/^I should see all change and remove recovery facility$/) do
  (1..5).each do |i|
    title = %w[First Second Third Fourth Fifth]
    expect(ChosenFacilitiesPage.new.facility_title(i)[0].text.gsub(/\n(.*)/, '')).to eq (Translations.value 'exportJourney.recoveryFacilities.multipleCardTitle').gsub('{{n}}', title[i - 1])
    expect(ChosenFacilitiesPage.new.facility_change_and_remove_link(i)[0].text.gsub(/\n(.*)/, '')).to eq Translations.value 'actions.change'
    expect(ChosenFacilitiesPage.new.facility_change_and_remove_link(i)[1].text.gsub(/\n(.*)/, '')).to eq Translations.value 'actions.remove'
  end
end

When(/^I update the recovery facility country$/) do
  fill_in 'Country', with: ''
  RecoveryFacilityAddressPage.new.select_recovery_facility_country('1st_recovery_facility_country')
end

Then(/^I should see previously entered recovery contact details pre\-populated$/) do
  expect(RecoveryFacilityContactDetailsPage.new).to have_full_name TestStatus.test_status('1st_recovery_facility_full_name'.to_sym)
  expect(RecoveryFacilityContactDetailsPage.new).to have_email TestStatus.test_status('1st_recovery_facility_email'.to_sym)
  expect(RecoveryFacilityContactDetailsPage.new).to have_phone_number TestStatus.test_status('1st_recovery_facility_phone_number'.to_sym)
  expect(RecoveryFacilityContactDetailsPage.new).to have_fax TestStatus.test_status('1st_recovery_facility_fax_number'.to_sym)
end

Then(/^I should see previously entered recovery code details pre\-populated$/) do
  expect(RecoveryFacilityContactDetailsPage.new).to have_recovery_code TestStatus.test_status(:first_recovery_facility_code)
end

Then(/^I should see updated recovery country$/) do
  expect(ChosenFacilitiesPage.new.first_recovery_facility_values[1].text).to eq TestStatus.test_status(:rec_country)
  # expect(RecoveryFacilityAddressPage.new).to have_country TestStatus.test_status('1st_recovery_facility_country'.to_sym)
end

Then(/^I should see remove recovery facility details page displayed$/) do
  RemoveRecoveryFacilityPage.new.check_page_displayed(TestStatus.test_status('2nd_recovery_facility_name'.to_sym).to_s)
end

Then(/^I should see "([^"]*)" error message displayed$/) do |error_message|
  expect(page).to have_text error_message
end

Then(/^the chosen facility page is displayed$/) do
  expect(self).to have_css 'h1', text: 'Your chosen facility', exact_text: true
end

And(/^I complete Treatment of waste section$/) do
  RecoveryFacilityController.complete
end

And(/^I see previously selected option pre\-selected$/) do
  expect(ConfirmationInterimSitePage.new.option_checked?('Yes')).to eq(true)
end

And(/^I should see (\d+)(st|nd|rd|th) recovery facility details$/) do |recovery_facility, suffix|
  expect(ChosenFacilitiesPage.new.recovery_facility_name_tags(recovery_facility)[0].text).to eq Translations.value 'exportJourney.recoveryFacilities.name'
  expect(ChosenFacilitiesPage.new.recovery_facility_name_tags(recovery_facility)[1].text).to eq Translations.value 'address.country'
  expect(ChosenFacilitiesPage.new.recovery_facility_name_tags(recovery_facility)[2].text).to eq Translations.value 'exportJourney.recoveryFacilities.recoveryCode'
  expect(ChosenFacilitiesPage.new.recovery_facility_values(recovery_facility)[0].text).to eq TestStatus.test_status("#{recovery_facility}#{suffix}_recovery_facility_name".to_sym)
  expect(ChosenFacilitiesPage.new.recovery_facility_values(recovery_facility)[1].text).to eq TestStatus.test_status("#{recovery_facility}#{suffix}_recovery_facility_country".to_sym)
  expect(ChosenFacilitiesPage.new.recovery_facility_values(recovery_facility)[2].text).to eq TestStatus.test_status(:first_recovery_facility_code)
end

Then(/^the recovery code page is displayed and correctly translated$/) do
  RecoveryCodePage.new.check_page_displayed
end

Then(/^I should see previously entered recovery facility details$/) do
  expect(RecoveryFacilityAddressPage.new).to have_name TestStatus.test_status('recovery_facility_name'.to_sym)
  expect(RecoveryFacilityAddressPage.new).to have_address TestStatus.test_status('recovery_facility_address'.to_sym)
  expect(RecoveryFacilityAddressPage.new).to have_country TestStatus.test_status('1st_recovery_facility_country_country'.to_sym)
end

Then(/^I should see previously entered recovery contact details$/) do
  expect(RecoveryFacilityContactDetailsPage.new).to have_full_name TestStatus.test_status('recovery_facility_full_name'.to_sym)
  expect(RecoveryFacilityContactDetailsPage.new).to have_email TestStatus.test_status('recovery_facility_email'.to_sym)
  expect(RecoveryFacilityContactDetailsPage.new).to have_phone_number TestStatus.test_status('recovery_facility_phone_number'.to_sym)
end

When(/^I enter invalid phone number for recovery facility details$/) do
  RecoveryFacilityContactDetailsPage.new.enter_full_name '1st_recovery_facility'
  RecoveryFacilityContactDetailsPage.new.enter_email '1st_recovery_facility'
  RecoveryFacilityContactDetailsPage.new.enter_invalid_phone_number '1st_recovery_facility'
end
