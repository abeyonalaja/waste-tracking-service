And(/^I complete recovery facility address page$/) do
  RecoveryFacilityAddressPage.new.enter_name('recover_facility')
  RecoveryFacilityAddressPage.new.enter_address('recover_facility')
  RecoveryFacilityAddressPage.new.enter_country('recover_facility')
end

And(/^I complete recovery facility contact details$/) do
  RecoveryFacilityContactDetailsPage.new.enter_full_name('recover_facility')
  RecoveryFacilityContactDetailsPage.new.enter_email('recover_facility')
  RecoveryFacilityContactDetailsPage.new.enter_phone_number('recover_facility')
  RecoveryFacilityContactDetailsPage.new.enter_fax_number('recover_facility')
end

When(/^I select first recovery code from the recovery facility$/) do
  RecoveryCodePage.new.select_first_option
  RecoveryCodePage.new.save_and_continue
end

Then(/^I should recovery list page is displayed with all the recovery details$/) do
  pending
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
