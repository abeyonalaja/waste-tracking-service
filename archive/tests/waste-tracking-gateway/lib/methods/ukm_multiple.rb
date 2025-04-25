# frozen_string_literal: true

# Provides a way of
module UkmMultiples
  def ukm_upload_csv(csv_file_name)
    url = "#{Env.host_url}/api/ukwm-batches"
    # Load the CSV file content
    file_path = File.open "#{File.dirname(__FILE__)}/../data/multiples/UKMV/#{csv_file_name}.csv"
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

  def read_json_file(file_path)
    file = File.read(file_path)
    JSON.parse(file)
  rescue JSON::ParserError => e
    puts "Failed to parse JSON from #{file_path}: #{e.message}"
    exit 1
  end

  def compare_json(obj1, obj2, path = [])
    differences = []

    if obj1.is_a?(Hash) && obj2.is_a?(Hash)
      all_keys = obj1.keys | obj2.keys
      all_keys.each do |key|
        next if %w[timestamp id].include?(key)  # Skip comparison for "timestamp" and "id" keys
        new_path = path + [key]
        differences += compare_json(obj1[key], obj2[key], new_path)
      end
    elsif obj1.is_a?(Array) && obj2.is_a?(Array)
      max_length = [obj1.length, obj2.length].max
      max_length.times do |index|
        new_path = path + [index]
        differences += compare_json(obj1[index], obj2[index], new_path)
      end
    else
      unless obj1 == obj2
        differences << { path: path, value1: obj1, value2: obj2 }
      end
    end

    differences
  end

  def format_path(path)
    path.map { |p| p.is_a?(Integer) ? "[#{p}]" : ".#{p}" }.join.sub(/^\./, '')
  end

  def print_differences(differences)
    differences.each do |diff|
      path_str = format_path(diff[:path])
      puts "Difference at '#{path_str}':"
      puts "Expected response: #{diff[:value1].inspect}"
      puts "Actual API response: #{diff[:value2].inspect}"
      puts
    end
  end


end
