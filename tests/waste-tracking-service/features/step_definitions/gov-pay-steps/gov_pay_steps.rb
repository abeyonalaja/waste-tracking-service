require 'yaml'

PAYMENT_DATA = YAML.load_file(File.join(File.dirname(__FILE__), '..', '..', '..', 'features', 'data', 'payment_data.yml'))['payment_data']

When('I enter the payment details for {string}') do |payment_type|
  data = PAYMENT_DATA[payment_type]
  enter_payment_details_page = EnterPaymentDetailsPage.new
  enter_payment_details_page.fill_in_cardholder_name 'Billy-Bob Jones'
  enter_payment_details_page.fill_in_card_number data['card_number']
  enter_payment_details_page.fill_in_cvc '123'
  enter_payment_details_page.fill_in_expiry_month '11'
  enter_payment_details_page.fill_in_expiry_year '27'
  enter_payment_details_page.fill_in_address_line_1 'Defra waste tracking limited'
  enter_payment_details_page.fill_in_address_line_2 'High Street'
  enter_payment_details_page.fill_in_city 'London'
  enter_payment_details_page.fill_in_postcode 'DE1 2FR'
  enter_payment_details_page.fill_in_email 'wts@wastetracking.com'

end

When('I complete the payment process') do
  click_button 'Confirm payment'
end

Then('I should see a {string} message') do |expected_message|
  expect(page).to have_content(expected_message)
end

Then(/^I should see enter payment detail page is displayed$/) do
  EnterPaymentDetailsPage.new.check_page_displayed
end

Then(/^I should see confirm your payment page is displayed$/) do
  ConfirmYourPaymentPage.new.check_page_displayed
end

Then(/^I should see description page correctly translated$/) do
  DescriptionPage.new.check_page_translation
end

And(/^I click Continue without payment button$/) do
  DescriptionPage.new.continue_no_pay_button
end

And(/^I click Pay service charge button$/) do
  DescriptionPage.new.pay_button
end

Then(/^I should see annual charge page correctly translated$/) do
  AnnualChargePage.new.check_page_translation
end

And(/^I see success payment page translated correctly$/) do
  SuccessPaymentPage.new.check_page_translation
end

And(/^I verify payment warning banner is displayed$/) do
  AccountPage.new.pay_header
  AccountPage.new.check_payment_banner_displayed
end

When(/^I click the Cancel payment link$/) do
  EnterPaymentDetailsPage.new.cancel_payment
end

And(/^I click the Cancel and go back to try the payment again link$/) do
  EnterPaymentDetailsPage.new.redirect_url
end

And(/^I click Green list waste app card$/) do
  AccountPage.new.create_green_list_waste_record
end

And(/^I click UKWM app card$/) do
  AccountPage.new.move_waste_in_uk_card
end
