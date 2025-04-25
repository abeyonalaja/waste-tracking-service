When(/^I navigate to the UKM task list page with reference$/) do
  AccountPage.new.move_waste_in_uk_card
  UkwmHomePage.new.create_ukm_single_waste_movement
  UkmReferenceNumberController.complete
end

Then(/^I should UKWM task link page is correctly displayed$/) do
  UkwmTaskListPage.new.check_page_displayed
  UkwmTaskListPage.new.check_page_translation
end

And(/^the UKWM task "([^"]*)" should be "([^"]*)"$/) do |task_name, task_status|
  expect(UkwmTaskListPage.new).to have_completed_badge_for_task task_name, task_status
end

Then(/^I should see waste producer and waste collection status should be "([^"]*)"$/) do |status|
  expect(UkwmTaskListPage.new.waste_producer_collection_details_status.text).to eq status
end

And(/^I should see UKWM waste reference on task list page$/) do
  # expect(UkwmTaskListPage.new).to have_text TestStatus.test_status(:ukm_reference_number)
end

Then(/^I should see Waste carrier details status should be "([^"]*)"$/) do |status|
  expect(UkwmTaskListPage.new.waste_carrier_details_status.text).to eq status
end

Then(/^I should see Waste receiver details status should be "([^"]*)"$/) do |status|
  expect(UkwmTaskListPage.new.waste_receiver_details_status.text).to eq status
end
