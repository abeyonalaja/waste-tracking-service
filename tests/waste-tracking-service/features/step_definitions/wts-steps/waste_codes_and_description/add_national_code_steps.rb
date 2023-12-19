Given(/^I navigate to National Code page$/) do
  ExportWasteFromUkPage.new.create_single_annex_record
  AddReferenceNumberController.complete
  TaskListPage.new.waste_codes_and_description
  WasteCodeController.complete
  EwcCodeController.complete
  NationalCodePage.new.check_page_displayed
end

And(/^I have selected "([^"]*)" option$/) do |yes_or_no|
  NationalCodePage.new.choose_option(yes_or_no)
end

Then(/^I verify copy text is present on the page$/) do
  # rubocop:disable Layout/LineLength
  expect(self).to have_text Translations.value('exportJourney.nationalCode.intro')
  # rubocop:enable Layout/LineLength
  expect(self).to have_text Translations.value('exportJourney.nationalCode.hint')
end

Then(/^I verify Yes option is selected$/) do
  expect(NationalCodePage.new.option_checked?('Yes')).to eq(true)
end

And(/^I have selected Yes and entered valid national code$/) do
  national_code = Faker::Base.regexify(/[a-zA-Z09]{50}/)
  NationalCodePage.new.choose_option Translations.value 'radio.yes'
  NationalCodePage.new.enter_input_value national_code
  TestStatus.set_test_status(:national_code_text, national_code)
end

And(/^I have selected Yes and entered in-valid national code$/) do
  NationalCodePage.new.choose_option Translations.value 'radio.yes'
  NationalCodePage.new.enter_input_value '/£$%'
end

Then(/^I should see national code pre-populated$/) do
  expect(NationalCodePage.new).to have_reference TestStatus.test_status(:national_code_text)
end

Then(/^I should see national code page is displayed$/) do
  NationalCodePage.new.check_page_displayed
end
