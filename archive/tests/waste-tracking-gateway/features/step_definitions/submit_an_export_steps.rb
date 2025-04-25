Then(/^I should default task status in the response$/) do
  expect(@response.code).to eq('201')
  body = JSON.parse(@response.body)
  expect((body['wasteDescription']['status'])).to eq('NotStarted')
  expect((body['wasteQuantity']['status'])).to eq('CannotStart')
  expect((body['exporterDetail']['status'])).to eq('NotStarted')
  expect((body['importerDetail']['status'])).to eq('NotStarted')
  expect((body['collectionDate']['status'])).to eq('NotStarted')
  expect((body['carriers']['status'])).to eq('NotStarted')
  expect((body['ukExitLocation']['status'])).to eq('NotStarted')
  expect((body['transitCountries']['status'])).to eq('NotStarted')
  expect((body['recoveryFacilityDetail']['status'])).to eq('CannotStart')
end
