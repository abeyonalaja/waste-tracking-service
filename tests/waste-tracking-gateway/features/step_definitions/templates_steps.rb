Given(/^I send a POST request to create a template$/) do
  @wts = WasteTracking.new('Local')
  @response = @wts.post_templates
  body = JSON.parse(@response.body)
  @template_id = body['id']
  Log.info("Template id is #{@template_id}")
end

Then(/^I should see template is successfully created$/) do
  expect(@response.code).to eq('201')
  log @response.body
end

Given(/^I send a POST request to create a template with name "([^"]*)"$/) do |name|
  @wts = WasteTracking.new('Local')
  @name = name + rand(10_000).to_s
  @response = @wts.post_templates @name
  body = JSON.parse(@response.body)
  @template_id = body['id']
end

Then(/^I should see template is cannot be created$/) do
  expect(@response.code).to eq('409')
end

When(/^I try to create a template with same name$/) do
  @response = @wts.post_templates @name
  body = JSON.parse(@response.body)
  @template_id = body['id']
end

When(/^I request the new created template details$/) do
  @response = @wts.get_template @template_id
end

Then(/^I should see template name is correctly displayed$/) do
  expect(@response.code).to eq('200')
  @get_template_response = JSON.parse(@response.body)
  name = @get_template_response['templateDetails']['name']
  expect(name).to eq(@name)
end

When(/^I request to delete the newly created template$/) do
  @response = @wts.delete_template @template_id
end

Then(/^I should see template is successfully deleted$/) do
  expect(@response.code).to eq('204')
end

When(/^I create an template from an existing template$/) do
  Log.info("Using existing template id  #{@template_id} to create new template")
  @response = @wts.post_template_with_existing_template @template_id
  body = JSON.parse(@response.body)
  @template_id = body['id']
  Log.info("new template Id is #{@template_id}")
end

When(/^I create an template from an existing template with same name$/) do
  Log.info("Template id is #{@template_id}")
  @response = @wts.post_template_with_existing_template @template_id, @name
end

Given(/^I send a POST request to create a template with no name$/) do
  @wts = WasteTracking.new('Local')
  @response = @wts.post_templates ''
  body = JSON.parse(@response.body)
  @template_id = body['id']
end

Then(/^I should see "([^"]*)" bad request response$/) do |code|
  expect(@response.code).to eq(code)
end

When(/^I request to add bulk waste description for a template$/) do
  @response = @wts.template_bulk_waste_description @template_id
end

Then(/^template request waste description should be completed$/) do
  @response = @wts.get_template @template_id
  body = JSON.parse(@response.body)
  expect(body['wasteDescription']['status']).to eq('Complete')
end

When(/^I request to add small waste description for a template$/) do
  @response = @wts.template_small_waste_description @template_id
end

When(/^I request to add exporter details for a template$/) do
  @response = @wts.template_exporter_detail @template_id
end

Then(/^waste description should be successfully added to the template$/) do
  @response = @wts.get_template @template_id
  body = JSON.parse(@response.body)
  expect(body['wasteDescription']['status']).to eq('Complete')
end

Then(/^exporter details should be successfully added to the template$/) do
  @response = @wts.get_template @template_id
  body = JSON.parse(@response.body)
  expect(body['exporterDetail']['status']).to eq('Complete')
end

When(/^I request to add importer details for a template$/) do
  @response = @wts.template_importer_detail @template_id
end

Then(/^importer details should be successfully added to the template$/) do
  @response = @wts.get_template @template_id
  body = JSON.parse(@response.body)
  expect(body['importerDetail']['status']).to eq('Complete')
end

When(/^I request to add waste carrier for a template$/) do
  @response = @wts.template_waste_carrier @template_id
  body = JSON.parse(@response.body)
  @waste_carrier_id = body['values'][0]['id']
  @response = @wts.template_waste_carrier_id @template_id, @waste_carrier_id
end

Then(/^waste carrier details should be successfully added to the template$/) do
  @response = @wts.get_template @template_id
  body = JSON.parse(@response.body)
  expect(body['carriers']['status']).to eq('Complete')
end

When(/^I request to add collection details for a template$/) do
  @response = @wts.template_collection_details @template_id
end

Then(/^collection details should be successfully added to the template$/) do
  @response = @wts.get_template @template_id
  body = JSON.parse(@response.body)
  expect(body['collectionDetail']['status']).to eq('Complete')
end

When(/^I request to add exit location for a template$/) do
  @response = @wts.template_exit_location @template_id
end

Then(/^exit location should be successfully added to the template$/) do
  @response = @wts.get_template @template_id
  body = JSON.parse(@response.body)
  expect(body['ukExitLocation']['exitLocation']['value']).to eq('Dover')
  expect(body['ukExitLocation']['status']).to eq('Complete')
end

When(/^I request to add transit countries for a template$/) do
  @response = @wts.template_transit_countries @template_id
end

Then(/^transit countries should be successfully added to the template$/) do
  @response = @wts.get_template @template_id
  body = JSON.parse(@response.body)
  expect(body['transitCountries']['values'][0]).to eq('Albania (AL)')
  expect(body['transitCountries']['status']).to eq('Complete')
end

When(/^I request to recovery facility for a template$/) do
  @response = @wts.start_recovery_facility @template_id
  body = JSON.parse(@response.body)
  @recovery_id = body['values'][0]['id']
  @response = @wts.template_add_recovery_facility @template_id, @recovery_id
end

Then(/^recovery facility should be successfully added to the template$/) do
  @response = @wts.get_template @template_id
  body = JSON.parse(@response.body)
  expect(body['recoveryFacilityDetail']['values'][0]['contactDetails']['fullName']).to eq('Joel Miller')
  expect(body['recoveryFacilityDetail']['status']).to eq('Complete')
end
