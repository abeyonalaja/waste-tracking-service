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
  @response = @wts.upload_csv 'about_waste_error'
  @incorrect_csv_response = JSON.parse(@response.body)
  @multiples_id = @incorrect_csv_response['id']
  Log.info("GLW wrong data CSV id is  #{@multiples_id}")
end

Then(/^I should see upload should fail with correct error message$/) do
  @wts = WasteTracking.new(@region)
  loop do
    status = get_status(@multiples_id)
    if status['state']['status'] != 'Processing'
      puts "Request #{@multiples_id} has been completed with status: #{status['state']['status']}"
      break
    else
      puts "Request #{@multiples_id} is still processing. Waiting for 5 seconds..."
      sleep(5) # Wait for 5 seconds before making the next request
    end
  end
  expect(@response.code).to eq('200')
end

Given(/^I upload a "([^"]*)" CSV with data$/) do |file_name|
  @wts = WasteTracking.new(@region)
  @response = @wts.upload_csv file_name
  @multiple_csv_response = JSON.parse(@response.body)
  @multiples_id = @multiple_csv_response['id']
  Log.info("GLW wrong data CSV id is  #{@multiples_id}")
end

def get_status(id)
  @wts = WasteTracking.new(@region)
  path = "/api/batches/#{id}"
  @response = @wts.call_api('get', path, '')
  JSON.parse(@response.body)
end

And(/^"([^"]*)" csv status should be "([^"]*)"$/) do |_file_name, status|
  response = get_status(@multiples_id)
  expect(response['state']['status']).to eq(status)
end

And(/^response message should match the "([^"]*)"$/) do |file_name|
  expected_json = read_json_file file_name
  actual_json = get_status(@multiples_id)
  differences = @wts.compare_json(expected_json, actual_json)

  if differences.empty?
    puts 'The JSON files are identical.'
  else
    @wts.print_differences(differences)
  end
  expect(true).to eq(@wts.compare_response_data(expected_json, actual_json))
end

def read_json_file(file_name)
  file_path = "#{File.dirname(__FILE__)}/../../lib/data/multiples/glw/expected_payloads/#{file_name}.json"
  json_data = File.read(file_path)
  # Parse the JSON data
  JSON.parse(json_data)
end

Given(/^I upload a UKM "([^"]*)" CSV with data$/) do |file_name|
  @wts = WasteTracking.new(@region)
  @response = @wts.ukm_upload_csv file_name
  @multiple_csv_response = JSON.parse(@response.body)
  @multiples_id = @multiple_csv_response['id']
  Log.info("UKM wrong data CSV id is  #{@multiples_id}")
end

Then(/^I should see UKM upload should fail with correct error message$/) do
  @wts = WasteTracking.new(@region)
  loop do
    status = get_ukm_csv_status(@multiples_id)
    if status['state']['status'] != 'Processing'
      puts "Request #{@multiples_id} has been completed with status: #{status['state']['status']}"
      break
    else
      puts "Request #{@multiples_id} is still processing. Waiting for 5 seconds..."
      sleep(5) # Wait for 5 seconds before making the next request
    end
  end
  expect(@response.code).to eq('200')
end

def get_ukm_csv_status(id)
  @wts = WasteTracking.new(@region)
  path = "/api/ukwm-batches/#{id}"
  @response = @wts.call_api('get', path, '')
  JSON.parse(@response.body)
end

And(/^"([^"]*)" UKM csv status should be "([^"]*)"$/) do |_file_name, status|
  response = get_ukm_csv_status(@multiples_id)
  expect(response['state']['status']).to eq(status)
end

And(/^UKM csv response message should match the "([^"]*)"$/) do |file_name|
  expected_json = ukm_read_json_file file_name
  actual_json = get_ukm_csv_status(@multiples_id)
  differences = @wts.compare_json(expected_json, actual_json)

  if differences.empty?
    puts 'The JSON files are identical.'
  else
    @wts.print_differences(differences)
  end
  expect(true).to eq(@wts.compare_response_data(expected_json, actual_json))
end

def ukm_read_json_file(file_name)
  file_path = "#{File.dirname(__FILE__)}/../../lib/data/multiples/UKMV/expected_payloads/#{file_name}.json"
  json_data = File.read(file_path)
  # Parse the JSON data
  JSON.parse(json_data)
end
