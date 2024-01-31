And(/^I should see collection date page correctly translated$/) do
  CollectionDatePage.new.check_translation
end

Then(/^I should see actual collection date helper text correctly translated$/) do
  CollectionDatePage.new.check_actual_collection_translation
end

Then(/^I should see estimate collection date helper text correctly translated$/) do
  CollectionDatePage.new.check_estimate_collection_translation
end

And(/^I enter valid Estimate collection date$/) do
  CollectionDatePage.new.enter_estimate_collection_date DateTime.now.next_day(7).strftime('%d %m %Y')
end

Then(/^I should see Collection date option "([^"]*)" is selected$/) do |option|
  expect(CollectionDatePage.new.collection_date_option(option)).to be_checked
end

And(/^I should see Estimate Collection date pre\-populated$/) do
  expect(CollectionDatePage.new).to have_estimate_collection_date TestStatus.test_status(:estimate_collection_date)
end

And(/^I enter valid Actual collection date$/) do
  CollectionDatePage.new.enter_actual_collection_date DateTime.now.next_day(7).strftime('%d %m %Y')
end

And(/^I should see Actual Collection date pre\-populated$/) do
  expect(CollectionDatePage.new).to have_actual_collection_date TestStatus.test_status(:actual_collection_date)

end

When(/^I enter past collection date$/) do
  CollectionDatePage.new.enter_actual_collection_date DateTime.now.prev_day(2).strftime('%d %m %Y')
end

When(/^I enter collection date as today$/) do
  CollectionDatePage.new.enter_actual_collection_date DateTime.now.strftime('%d %m %Y')
end

And(/^I complete collection date with estimated details$/) do
  CollectionDatePage.new.choose_option Translations.value 'exportJourney.wasteCollectionDate.radioNo'
  CollectionDatePage.new.enter_estimate_collection_date DateTime.now.next_day(5).strftime('%d %m %Y')
  CollectionDatePage.new.save_and_return
end
