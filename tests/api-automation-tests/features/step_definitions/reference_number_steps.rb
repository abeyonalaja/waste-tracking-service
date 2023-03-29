Given(/^I POST reference number "([^"]*)" for waste export$/) do |ref_number|
  uri = URI.parse "#{Env.service}"
  http = Net::HTTP.new(uri.host, uri.port)
  request = Net::HTTP::Post.new('/submission', { 'Content-Type' => 'application/json' })
  payload = '{
	"reference": "testing"
}'

  http.set_debug_output($stdout)

  payload = JSON.parse(payload)
  payload['reference'] = ref_number
  request.body = payload.to_json
  @response = http.request(request)
end

Then(/^reference number should be successfully created$/) do
  expect(@response.code).to eq('201')
  body = JSON.parse(@response.body)
  expect(Helper.new.validate_uuid_format(body['submissionId'])).to eq(true)
end

Then(/^reference number should not be created$/) do
  expect(@response.code).to eq('400')
end
