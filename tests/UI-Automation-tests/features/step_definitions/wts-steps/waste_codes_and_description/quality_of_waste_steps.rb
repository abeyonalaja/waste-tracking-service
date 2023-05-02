When(/^the quality of waste page is displayed$/) do
  QuantityOfWastePage.new.check_page_displayed
end

Then(/^I have options "([^"]*)"$/) do |option|
  value = Translations.key(option)
  expect(page).to have_text(Translations.value(value))
end

And(/^I navigate to Quantity of waste page$/) do
  SubmitAnExportPage.new.waste_codes_and_description
  WasteCodeController.complete
  EwcCodeController.complete
  NationalCodeController.complete
  DescribeTheWasteController.complete
end

Then(/^the What is the actual net weight of the waste is displayed$/) do
  NetWeightPage.new.check_page_displayed
end

And(/^I should see net weight page is correctly translated$/) do
  NetWeightPage.new.check_translation
end

And(/^I enter valid weight in tonnes$/) do
  weight_in_tonnes = Faker::Number.decimal(l_digits: 3, r_digits: 2)
  NetWeightPage.new.enter_weight_in_tonnes weight_in_tonnes
  TestStatus.set_test_status(:weight_in_tonnes, weight_in_tonnes)
  Log.info("Weight in tonnes, #{weight_in_tonnes}")
end

Then(/^I should see quantity option "([^"]*)" is selected$/) do |option|
  expect(QuantityOfWastePage.new.quantity_of_weight(option)).to be_checked
end

Then(/^I should see previously entered weight in tonnes pre\-populated$/) do
  expect(QuantityOfWastePage.new.weight_in_tonnes).to eq TestStatus.test_status(:weight_in_tonnes).to_s
end

And(/^I enter valid weight in cubic meters$/) do
  weight_in_cubic_meters = Faker::Number.decimal(l_digits: 3, r_digits: 2)
  NetWeightPage.new.enter_weight_in_cubic_meters weight_in_cubic_meters
  TestStatus.set_test_status(:weight_in_cubic_meters, weight_in_cubic_meters)
  Log.info("Weight in cubic meters, #{weight_in_cubic_meters}")
end

Then(/^I should see previously entered weight in cubic meters pre\-populated$/) do
  expect(QuantityOfWastePage.new.weight_in_cubic_meters).to eq TestStatus.test_status(:weight_in_cubic_meters).to_s
end

When(/^I enter invalid weight in cubic meters$/) do
  weight_in_cubic_meters = Faker::Number.decimal(l_digits: 3, r_digits: 4)
  NetWeightPage.new.enter_weight_in_cubic_meters weight_in_cubic_meters
  TestStatus.set_test_status(:weight_in_tonnes, weight_in_cubic_meters)
  Log.info("Weight in cubic meters, #{weight_in_cubic_meters}")
end

When(/^I enter invalid weight in tonnes$/) do
  weight_in_tonnes = Faker::Number.decimal(l_digits: 3, r_digits: 4)
  NetWeightPage.new.enter_weight_in_tonnes weight_in_tonnes
  TestStatus.set_test_status(:weight_in_tonnes, weight_in_tonnes)
  Log.info("Weight in tonnes, #{weight_in_tonnes}")
end

Then(/^the What is the estimate net weight of the waste is displayed$/) do
  EstimatedWeightPage.new.check_page_displayed
end

And(/^I should see estimate net weight page is correctly translated$/) do
  EstimatedWeightPage.new.check_translation
end
