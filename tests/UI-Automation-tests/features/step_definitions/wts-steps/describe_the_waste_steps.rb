Then(/^I verify Describe waste page is displayed$/) do
  DescribeTheWastePage.new.check_page_displayed
end

When(/^I add a description of the waste up to 100 characters$/) do
  description = Faker::Base.regexify(/[a-z \s A-Z\s \\0-9- \s ]{50}/)
  TestStatus.set_test_status(:description_of_the_waste, description)
  DescribeTheWastePage.new.enter_description description
end

Then(/^the number of characters decreases on the counter$/) do
  expect(DescribeTheWastePage.new.remaining_characters.text).to eq('You have 50 character remaining')
end
