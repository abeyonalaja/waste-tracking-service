Given(/^I POST reference number "([^"]*)" for waste export$/) do |ref_number|
  uri = URI.parse Env.host_url.to_s
  http = Net::HTTP.new(uri.host, uri.port)
  http.use_ssl = true if uri.instance_of? URI::HTTPS
  headers = { 'Content-Type': 'application/json' }
  request = Net::HTTP::Post.new('/api/submissions', headers)
  payload = '{
	"reference": "testing"
}'

  http.set_debug_output($stdout)
  payload = JSON.parse(payload)
  payload['reference'] = ref_number
  @reference = ref_number
  request.body = payload.to_json
  @response = http.request(request)
end

Then(/^reference number should be successfully created$/) do
  expect(@response.code).to eq('201')
  body = JSON.parse(@response.body)
  expect((body['reference'])).to eq(@reference)
  expect(Helper.new.validate_uuid_format(body['id'])).to eq(true)
  @id = body['id']
end

Then(/^reference number should not be created$/) do
  expect(@response.code).to eq('400')
end

Given(/^I POST long reference number "([^"]*)" for waste export$/) do |reference|
  uri = URI.parse Env.host_url.to_s
  http = Net::HTTP.new(uri.host, uri.port)
  http.use_ssl = true if uri.instance_of? URI::HTTPS
  headers = { 'Content-Length': 'multipart/form-data' }
  request = Net::HTTP::Post.new('/api/submissions', headers)
  payload = '{
	"reference": "testing"
}'

  http.set_debug_output($stdout)
  payload = JSON.parse(payload)
  payload['reference'] = reference
  request.body = payload.to_json
  @response = http.request(request)
end

When(/^I amend the reference number to "([^"]*)" for waste export$/) do |reference|
  uri = URI.parse Env.host_url.to_s
  http = Net::HTTP.new(uri.host, uri.port)
  http.use_ssl = true if uri.instance_of? URI::HTTPS
  headers = { 'Content-Length': 'text/plain', 'Content-Type': 'text/plain' }
  request = Net::HTTP::Put.new("/api/submissions/#{@id}/reference", headers)
  payload = '{"reference"}'

  http.set_debug_output($stdout)
  payload = payload.gsub('reference', reference)
  @reference = reference
  request.body = payload.to_s
  @response = http.request(request)
end

Then(/^reference number should be successfully updated$/) do
  expect(@response.code).to eq('200')
end
