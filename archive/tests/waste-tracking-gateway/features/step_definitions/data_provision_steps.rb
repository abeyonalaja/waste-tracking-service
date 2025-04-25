Given(/^I request waste code for "([^"]*)"$/) do |lang|
  @wts = WasteTracking.new(@region)
  path = "/api/reference-data/waste-codes?language=#{lang}"
  @response = @wts.call_api('get', path, '')
  @body = JSON.parse(@response.body)
  expect(@response.code).to eq('200')
end

Then(/^I should see all the waste code$/) do
  types_to_check = %w[BaselAnnexIX OECD AnnexIIIA AnnexIIIB]
  type_found = {}
  @body.each do |object|
    type = object['type']
    type_found[type] = true if types_to_check.include?(type)
  end

  types_to_check.each do |type|
    if type_found[type]
      log "Type #{type} found in the JSON data."
    else
      log raise "Waste code not found  #{type}"
    end
  end
end

Then(/^I should see all the waste code for "([^"]*)"$/) do |lang|
  en_list = %w[BaselAnnexIX OECD AnnexIIIA AnnexIIIB]
  cy_list = %w[BaselAnnexIX OECD AnnexIIIA AnnexIIIB]
  list_to_check = lang == 'en' ? en_list : cy_list
  type_found = {}
  @body.each do |object|
    type = object['type']
    type_found[type] = true if list_to_check.include?(type)
  end

  list_to_check.each do |type|
    if type_found[type]
      log "Type #{type} found in the JSON data."
    else
      raise "Waste code not found  #{type}"
    end
  end
end

Given(/^I request EWC code for "([^"]*)"$/) do |lang|
  @wts = WasteTracking.new(@region)
  path = "/api/reference-data/ewc-codes?language=#{lang}"
  @response = @wts.call_api('get', path, '')
  @body = JSON.parse(@response.body)
  expect(@response.code).to eq('200')
end

Then(/^I should see all the EWC code for "([^"]*)"$/) do |lang|
  expect(@response.code).to eq('200')
end

Given(/^I request countries$/) do
  @wts = WasteTracking.new(@region)
  path = '/api/reference-data/countries'
  @response = @wts.call_api('get', path, '')
  @body = JSON.parse(@response.body)
end

Then(/^I should see all the countries$/) do
  expect(@response.code).to eq('200')
end
