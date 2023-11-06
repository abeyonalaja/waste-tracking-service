# frozen_string_literal: true
require_relative 'template_operations'

# class will handle all change API operations, need to pass the title and operation payload
module Operations
  include TemplateOperations

  def call_api(request_type, path, payload)
    http = create_request_details
    request = nil
    case request_type
    when 'post'
      request = Net::HTTP::Post.new(path, { 'Content-Type' => 'application/json' })
      request.body = payload
    when 'put'
      request = Net::HTTP::Put.new(path, { 'Content-Type' => 'application/json' })
      request.body = payload
    when 'get'
      request = Net::HTTP::Get.new(path, { 'Content-Type' => 'application/json' })
    when 'delete'
      request = Net::HTTP::Delete.new(path, { 'Content-Type' => 'application/json' })
    else
      p 'invalid request type'
    end
    # request['Authorization'] = @tm_environment.url["#{api}_token"]
    http.request(request)
  end

  def create_request_details
    uri = URI.parse Env.host_url.to_s
    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = true if uri.instance_of? URI::HTTPS
    http.set_debug_output($stdout)
    http
  end

end
