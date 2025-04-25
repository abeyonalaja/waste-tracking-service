And(/^I should see Location waste leave page correctly translated$/) do
  LocationWasteLeavesTheUkPage.new.check_translation
end

And(/^I enter location$/) do
  LocationWasteLeavesTheUkPage.new.enter_location 'Ne,w-P.o\'rt'
end

Then(/^I can see previously entered location details pre-populated$/) do
  expect(LocationWasteLeavesTheUkPage.new).to have_reference_location TestStatus.test_status('waste_leaves_UK_location')
  expect(LocationWasteLeavesTheUkPage.new.option_checked?('Yes')).to eq(true)
end

Then(/^I can see newly chosen option pre-populated$/) do
  expect(LocationWasteLeavesTheUkPage.new.option_checked?('No')).to eq(true)
end

And(/^I enter invalid location$/) do
  LocationWasteLeavesTheUkPage.new.enter_location 'New-Port!@#/'
end
