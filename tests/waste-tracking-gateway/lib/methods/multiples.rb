# frozen_string_literal: true

# Provides a way of
module Multiples
  def post_glw_multiples(csv_file_name = 'test-single_row')
    path = '/api/batches'

    # boundary = '----------boundary_of_multipart_request_$'
    boundary = 'boundary=--------------------------491279191057335735012232'
    # request.set_content_type("multipart/form-data; boundary=#{boundary}")

    # Load the CSV file content
    file_path = File.open "#{File.dirname(__FILE__)}/../data/multiples/#{csv_file_name}.csv"
    csv_file_content = File.read file_path



    # Build the request body
    payload = <<EOF
--#{boundary}\r
Content-Disposition: form-data; name="file"; filename="file.csv"\r
Content-Type: text/csv\r
\r
#{csv_file_content}\r
--#{boundary}--\r
EOF

    # payload = form_data
    Log.info('Creating new GLW multiple CSV')

    call_api('post', path, payload, "multipart/form-data; boundary=#{boundary}")
  end
end
