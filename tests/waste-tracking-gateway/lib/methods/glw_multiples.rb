# frozen_string_literal: true

# Provides a way of
module GlwMultiples
  def upload_csv(csv_file_name)
    url = "#{Env.host_url.to_s}/api/batches"
    # Load the CSV file content
    file_path = File.open "#{File.dirname(__FILE__)}/../data/multiples/glw/#{csv_file_name}.csv"
    headers = { 'Authorization' => "Bearer #{$token}" }
    RestClient.post(url, { csv: File.new(file_path, 'rb') }, headers: headers, multipart: true, authorization: "Bearer #{$token}")
  end

  def process_request(id)
    loop do
      status = get_status(id)
      if status['state']['status'] != 'Processing'
        puts "Request #{id} has been completed with status: #{status['state']['status']}"
        break
      else
        puts "Request #{id} is still processing. Waiting for 5 seconds..."
        sleep(5) # Wait for 5 seconds before making the next request
      end
    end
  end

  def get_status(id)
    @wts = WasteTracking.new(@region)
    path = "/api/batches/#{@multiples_id}"
    @response = @wts.call_api('get', path, '')
    JSON.parse(@response.body)
  end

  def compare_response_data(expected_json, actual_json)
    # Remove the "timestamp" key from both JSON objects
    expected_json_without_timestamp = expected_json.dup
    expected_json_without_timestamp.delete('id')
    expected_json_without_timestamp['state']&.delete('timestamp')
    actual_json_without_timestamp = actual_json.dup
    actual_json_without_timestamp.delete('id')
    actual_json_without_timestamp['state']&.delete('timestamp')

    puts "Expected JSON: #{expected_json_without_timestamp.inspect}"
    puts "Actual JSON: #{actual_json_without_timestamp.inspect}"

    expected_json_without_timestamp == actual_json_without_timestamp
  end

end
