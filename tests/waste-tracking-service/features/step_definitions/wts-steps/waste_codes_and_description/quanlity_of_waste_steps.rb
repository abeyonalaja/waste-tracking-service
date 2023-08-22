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
  EstimateWeightPage.new.check_page_displayed
end

And(/^I should see estimate net weight page is correctly translated$/) do
  EstimateWeightPage.new.check_translation
end

And(/^I navigate to Quantity of waste page with "([^"]*)" has waste code$/) do |waste_code|
  SubmitAnExportPage.new.waste_codes_and_description
  WasteCodeController.complete waste_code
  EwcCodeController.complete ' '
  NationalCodeController.complete
  DescribeTheWasteController.complete
end

And(/^I complete Waste codes and description task with "([^"]*)" has waste code$/) do |waste_code|
  SubmitAnExportPage.new.waste_codes_and_description
  WasteCodeController.complete waste_code
  EwcCodeController.complete ' '
  NationalCodeController.complete
  DescribeTheWasteController.complete
  sleep 1
  QuantityOfSmallWastePage.new.check_page_displayed
  QuantityOfWastePage.new.back
  DescribeTheWastePage.new.save_and_return
end

Then(/^What is the actual net weight of the small weight waste is displayed$/) do
  NetSmallWeightPage.new.check_page_displayed
end

And(/^I should see net small weight page is correctly translated$/) do
  NetSmallWeightPage.new.check_translation
end

Then(/^the What is the estimate net weight of the small weight waste is displayed$/) do
  EstimateSmallWeightPage.new.check_page_displayed
end

And(/^I should see estimate net small weight page is correctly translated$/) do
  EstimateSmallWeightPage.new.check_translation
end

And(/^I enter valid weight in kilograms$/) do
  weight_in_kilograms = Faker::Number.between(from: 0.0, to: 25.0).round(2)
  NetWeightPage.new.enter_weight_in_kilograms weight_in_kilograms
  TestStatus.set_test_status(:weight_in_kilograms, weight_in_kilograms)
  Log.info("Weight in kilograms, #{weight_in_kilograms}")
end

Then(/^I should see previously entered weight in kilograms pre\-populated$/) do
  expect(QuantityOfWastePage.new.weight_in_kilograms).to eq TestStatus.test_status(:weight_in_kilograms).to_s
end

Then(/^I should see quantity option "([^"]*)" is not selected$/) do |option|
  expect(QuantityOfWastePage.new.quantity_of_weight(option)).not_to be_checked
end

When(/^I enter invalid weight in kilograms$/) do
  weight_in_kilometers = Faker::Number.decimal(l_digits: 3, r_digits: 4)
  NetWeightPage.new.enter_weight_in_kilograms weight_in_kilometers
  TestStatus.set_test_status(:weight_in_kilometers, weight_in_kilometers)
  Log.info("Weight in kilograms, #{weight_in_kilometers}")
end

And(/^I enter weight more than 25 kilograms$/) do
  weight_in_kilometers = Faker::Number.between(from: 25.0, to: 1000.0).round(2)
  NetWeightPage.new.enter_weight_in_kilograms weight_in_kilometers
  TestStatus.set_test_status(:weight_in_kilometers, weight_in_kilometers)
  Log.info("Weight in kilograms, #{weight_in_kilometers}")
end

Then(/^the quality of small waste page is displayed$/) do
  QuantityOfSmallWastePage.new.check_page_displayed
end

Then(/^I should see quantity of waste correctly translated$/) do
  QuantityOfWastePage.new.check_page_translation
end

And(/^I should see quantity of small waste correctly translated$/) do
  QuantityOfSmallWastePage.new.check_page_translated
end

And(/^I complete Quantity of waste sub\-section$/) do
  QuantityOfWasteController.complete
end

When(/^I complete Quantity of waste with estimated bulk waste$/) do
  QuantityOfWasteController.complete 'No, I will enter an estimate'
end

When(/^I complete Quantity of waste with estimated small waste$/) do
  QuantityOfSmallWasteController.complete 'No, I will enter an estimate'
end
