Given(/^I upload a CSV with single row with actual data$/) do
  @wts = WasteTracking.new(@region)
  @response = @wts.post_glw_multiples
  body = JSON.parse(@response.body)
  @glw_multiple = body['id']
  Log.info("GLW Single row CSV id is #{@glw_multiple}")
end

Then(/^I should see export is created successfully$/) do
  uuid_pattern = /\A[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\z/i
  expect(@glw_multiple).to match(uuid_pattern)
end

Given(/^I upload a CSV with wrong data$/) do
  @wts = WasteTracking.new(@region)
  @response = @wts.post_glw_multiples 'about_waste_errors'
  @incorrect_csv_response = JSON.parse(@response.body)
  Log.info("GLW wrong data CSV id is  #{@incorrect_csv_response}")
end

Then(/^I should see upload should fail with correct error message$/) do

end
