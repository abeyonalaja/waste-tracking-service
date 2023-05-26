And(/^I should see Location waste leave page correctly translated$/) do
  LocationWasteLeavesTheUkPage.new.check_translation
end

And(/^I enter location$/) do
  LocationWasteLeavesTheUkPage.new.enter_location 'NewPort'
end

Then(/^I can see previously entered location details pre-populated$/) do
  expect(LocationWasteLeavesTheUkPage.new).to have_reference_location TestStatus.test_status('location')
  expect(LocationWasteLeavesTheUkPage.new.option_checked?('Yes')).to eq(true)
end

Then(/^I can see newly chosen option pre-populated$/) do
  expect(LocationWasteLeavesTheUkPage.new.option_checked?('No')).to eq(true)
end
