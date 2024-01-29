# frozen_string_literal: true
require_relative 'template_operations'
require_relative 'multiples'

# class will handle all change API operations, need to pass the title and operation payload
module Operations
  include TemplateOperations
  include Multiples

  def call_api(request_type, path, payload, content_type = 'application/json')
    http = create_request_details
    request = build_request(request_type, path, payload, content_type)
    http.request(request)
  end

  def create_request_details
    uri = URI.parse(Env.host_url.to_s)
    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = true if uri.instance_of? URI::HTTPS
    http.set_debug_output($stdout)
    http
  end

  private

  def build_request(request_type, path, payload, content_type)
    headers = { 'Content-Type': content_type, 'Authorization': "Bearer #{$token}" }
    case request_type.downcase
    when 'post'
      build_post_request(path, payload, headers)
    when 'put'
      build_put_request(path, payload, headers)
    when 'get'
      build_get_request(path, headers)
    when 'delete'
      build_delete_request(path, headers)
    else
      raise 'Invalid request type'
    end
  end

  def build_post_request(path, payload, headers)
    request = Net::HTTP::Post.new(path, headers)
    request.body = payload
    request
  end

  def build_put_request(path, payload, headers)
    request = Net::HTTP::Put.new(path, headers)
    request.body = payload
    request
  end

  def build_get_request(path, headers)
    Net::HTTP::Get.new(path, headers)
  end

  def build_delete_request(path, headers)
    Net::HTTP::Delete.new(path, headers)
  end

end
