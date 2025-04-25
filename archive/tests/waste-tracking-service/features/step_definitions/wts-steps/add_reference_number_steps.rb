When(/^I navigate to the add reference page$/) do
  ExportWasteFromUkPage.new.create_single_annex_record
  AddReferenceNumberPage.new.check_page_displayed
end

And(/^I see the breadcrumb Waste tracking service, Green list waste overview, Your reference displayed$/) do
  AddReferenceNumberPage.new.check_bread_crumbs_translation
end

When(/^I click Export waste from the UK from the breadcrumb$/) do
  AddReferenceNumberPage.new.export_waste_from_the_uk
end

And(/^I have entered my reference$/) do
  AddReferenceNumberController.complete
end

Then(/^I should see reference number pre\-populated$/) do
  HelperMethods.wait_for_a_sec
  expect(AddReferenceNumberPage.new).to have_reference TestStatus.test_status(:application_reference_number)
end

When(/^I have neither selected the Yes or No option$/) do
  puts "don't select anything"
end

When(/^I have entered an invalid special character as part of the reference$/) do
  AddReferenceNumberPage.new.enter_reference_number Faker::Base.regexify(%r{[a-zA-Z0-9\&^£-]{20}})
end

When(/^I have entered less than the required character length$/) do
  AddReferenceNumberPage.new.enter_reference_number Faker::Base.regexify(%r{[a-zA-Z0-9]{1}})
end

When(/^I amend the previously entered reference$/) do
  reference = 'newreference123'
  add_reference_number_page = AddReferenceNumberPage.new
  add_reference_number_page.enter_reference_number reference
  TestStatus.set_test_status(:new_application_reference_number, reference)
  add_reference_number_page.save_and_continue
  HelperMethods.wait_for_a_sec
end

When(/^I have entered an invalid reference containing more than (\d+) characters$/) do |arg|
  ref = Faker::Base.regexify(%r{[a-zA-Z0-9]{21}})
  AddReferenceNumberPage.new.enter_reference_number ref
  Log.info("App ref -#{ref}")
end

Then(/^I should see enter reference page correctly translated$/) do
  AddReferenceNumberPage.new.check_page_translation
end

And(/^I enter valid reference$/) do
  unique_reference = "#{Faker::Name.first_name}REF"
  add_reference_number_page = AddReferenceNumberPage.new
  add_reference_number_page.enter_reference_number unique_reference
  add_reference_number_page.save_and_continue
  TestStatus.set_test_status(:unique_reference, unique_reference)
end
