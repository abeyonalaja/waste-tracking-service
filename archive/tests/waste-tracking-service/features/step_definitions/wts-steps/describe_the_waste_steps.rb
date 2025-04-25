Then(/^I verify Describe waste page is displayed$/) do
  DescribeTheWastePage.new.check_page_displayed
end

When(/^I add a description of the waste up to 100 characters$/) do
  description = Faker::Base.regexify(/[a-zA-Z]{100}/)
  TestStatus.set_test_status(:description_of_the_waste, description)
  DescribeTheWastePage.new.enter_description description
end

Then(/^the number of characters decreases on the counter$/) do
  expect(DescribeTheWastePage.new.remaining_characters.text).to eq('You have 0 characters remaining')
end

Then(/^I should see waste description pre\-populated$/) do
  expect(DescribeTheWastePage.new).to have_reference TestStatus.test_status(:description_of_the_waste)
end
