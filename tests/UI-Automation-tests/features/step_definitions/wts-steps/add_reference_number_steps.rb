When(/^I navigate to the add reference page$/) do
  click_link('Green list waste overview')
  OverviewPage.new.submit_a_single_waste_export
  AddReferenceNumberPage.new.check_page_displayed
end

And(/^I see the breadcrumb Waste tracking service, Green list waste overview, Your reference displayed$/) do
  expect(page).to have_link('Green list waste overview')
  expect(page).to have_link('Waste tracking service')
end

When(/^I click Green list waste overview from the breadcrumb$/) do
  click_link('Green list waste overview')
end

And(/^I have selected Yes and entered my reference$/) do
  AddReferenceNumberController.complete
end

Then(/^I should see reference number pre\-populated$/) do
  expect(AddReferenceNumberPage.new).to have_reference TestStatus.test_status(:application_reference_number)
end

When(/^I have selected the No option$/) do
  AddReferenceNumberPage.new.choose_option 'No'
end

And(/^I click the button Save and continue$/) do
  AddReferenceNumberPage.new.save_and_continue
end

When(/^I have neither selected the Yes or No option$/) do
  puts "don't select anything"
end

When(/^I have entered an invalid special character as part of the reference$/) do
  AddReferenceNumberPage.new.choose_option 'Yes'
  AddReferenceNumberPage.new.enter_reference_number Faker::Base.regexify(%r{[a-zA-Z0-9\&^£-]{51}})
end

When(/^I have entered less than the required character length$/) do
  AddReferenceNumberPage.new.choose_option 'Yes'
  AddReferenceNumberPage.new.enter_reference_number Faker::Base.regexify(%r{[a-zA-Z0-9\-/]{1}})
end
