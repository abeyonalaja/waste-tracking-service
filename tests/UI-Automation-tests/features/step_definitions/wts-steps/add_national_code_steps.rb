Given(/^I navigate to National Code page$/) do
  click_link('Green list waste overview')
  OverviewPage.new.submit_a_single_waste_export
  AddReferenceNumberController.complete
  SubmitAnExportPage.new.waste_codes_and_description
  WasteCodeController.complete()
  click_link('Continue to National code page')
  NationalCodePage.new.check_page_displayed
end

And(/^I have selected "([^"]*)" option$/) do |yes_or_no|
  NationalCodePage.new.choose_option(yes_or_no)
end

Then(/^I verify copy text is present on the page$/) do
  # rubocop:disable Layout/LineLength
  expect(self).to have_text('A national code is also known as a commodity code and may be required by the country you’re exporting to.')
  # rubocop:enable Layout/LineLength
  expect(self).to have_text('This information is optional.')
end

Then(/^I verify Yes option is selected$/) do
  expect(NationalCodePage.new.option_checked?('Yes')).to eq(true)
end

And(/^I have selected Yes and entered valid national code$/) do
  national_code = Faker::Base.regexify(/[a-z \s A-Z\s \\0-9- \s ]{50}/)
  NationalCodePage.new.choose_option 'Yes'
  NationalCodePage.new.enter_input_value national_code
  TestStatus.set_test_status(:national_code, national_code)
end

And(/^I have selected Yes and entered in-valid national code$/) do
  NationalCodePage.new.choose_option 'Yes'
  NationalCodePage.new.enter_input_value '/£$%'
end

Then(/^I should see national code pre-populated$/) do
  expect(NationalCodePage.new).to have_reference TestStatus.test_status(:national_code)
end
