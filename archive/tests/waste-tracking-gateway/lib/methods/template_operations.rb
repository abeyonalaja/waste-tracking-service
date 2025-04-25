# frozen_string_literal: true

# Provides a way of
module TemplateOperations

  def post_templates(name = Faker::Number.unique.number(digits: 10).to_s)
    path = '/api/templates'
    file_path = File.open "#{File.dirname(__FILE__)}/../data/template/create_template.json"
    payload = JSON.load file_path
    payload['templateDetails']['name'] = name
    Log.info("Creating new template with template name: #{name}")
    updated_payload_json = payload.to_json
    call_api('post', path, updated_payload_json)
  end

  def get_template(template_id)
    path = "/api/templates/#{template_id}"
    call_api('get', path, '')
  end

  def delete_template(template_id)
    path = "/api/templates/#{template_id}"
    call_api('delete', path, '')
  end

  def post_template_with_existing_template(template_id, name = Faker::Number.unique.number(digits: 10).to_s)
    path = "/api/templates/copy-template/#{template_id}"
    file_path = File.open "#{File.dirname(__FILE__)}/../data/template/create_template.json"
    payload = JSON.load file_path
    payload['templateDetails']['name'] = name
    updated_payload_json = payload.to_json
    call_api('post', path, updated_payload_json)
  end

  def template_bulk_waste_description(template_id)
    path = "/api/templates/#{template_id}/waste-description"
    file_path = File.open "#{File.dirname(__FILE__)}/../data/template/bulk_waste_description.json"
    payload = JSON.load file_path
    updated_payload_json = payload.to_json
    Log.info("template bulk waste description payload #{updated_payload_json}")
    call_api('put', path, updated_payload_json)
  end

  def template_small_waste_description(template_id)
    path = "/api/templates/#{template_id}/waste-description"
    file_path = File.open "#{File.dirname(__FILE__)}/../data/template/small_waste_description.json"
    payload = JSON.load file_path
    updated_payload_json = payload.to_json
    Log.info("template small waste description payload #{updated_payload_json}")
    call_api('put', path, updated_payload_json)
  end

  def template_exporter_detail(template_id)
    path = "/api/templates/#{template_id}/exporter-detail"
    file_path = File.open "#{File.dirname(__FILE__)}/../data/template/exporter_details.json"
    payload = JSON.load file_path
    updated_payload_json = payload.to_json
    Log.info("template exporter details waste description payload #{updated_payload_json}")
    call_api('put', path, updated_payload_json)
  end

  def template_importer_detail(template_id)
    path = "/api/templates/#{template_id}/importer-detail"
    file_path = File.open "#{File.dirname(__FILE__)}/../data/template/importer_details.json"
    payload = JSON.load file_path
    updated_payload_json = payload.to_json
    Log.info("template importer details waste description payload #{updated_payload_json}")
    call_api('put', path, updated_payload_json)
  end

  def template_waste_carrier(template_id)
    path = "/api/templates/#{template_id}/carriers"
    file_path = File.open "#{File.dirname(__FILE__)}/../data/template/status.json"
    payload = JSON.load file_path
    updated_payload_json = payload.to_json
    call_api('post', path, updated_payload_json)
  end

  def template_waste_carrier_id(template_id, carrier_id)
    path = "/api/templates/#{template_id}/carriers/#{carrier_id}"
    file_path = File.open "#{File.dirname(__FILE__)}/../data/template/waste_carrier.json"
    payload = JSON.load file_path
    payload['values'][0]['id'] = carrier_id
    updated_payload_json = payload.to_json
    Log.info("template waste carrier details waste description payload #{updated_payload_json}")
    call_api('put', path, updated_payload_json)
  end

  def template_collection_details(template_id)
    path = "/api/templates/#{template_id}/collection-detail"
    file_path = File.open "#{File.dirname(__FILE__)}/../data/template/collection_details.json"
    payload = JSON.load file_path
    updated_payload_json = payload.to_json
    call_api('put', path, updated_payload_json)
  end

  def template_exit_location(template_id)
    path = "/api/templates/#{template_id}/exit-location"
    file_path = File.open "#{File.dirname(__FILE__)}/../data/template/exit_location.json"
    payload = JSON.load file_path
    updated_payload_json = payload.to_json
    call_api('put', path, updated_payload_json)
  end

  def template_transit_countries(template_id)
    path = "/api/templates/#{template_id}/transit-countries"
    file_path = File.open "#{File.dirname(__FILE__)}/../data/template/transit_countries.json"
    payload = JSON.load file_path
    updated_payload_json = payload.to_json
    call_api('put', path, updated_payload_json)
  end

  def start_recovery_facility(template_id)
    path = "/api/templates/#{template_id}/recovery-facility"
    file_path = File.open "#{File.dirname(__FILE__)}/../data/template/status.json"
    payload = JSON.load file_path
    updated_payload_json = payload.to_json
    call_api('post', path, updated_payload_json)
  end

  def template_add_recovery_facility(template_id, recovery_facility_id)
    path = "/api/templates/#{template_id}/recovery-facility/#{recovery_facility_id}"
    file_path = File.open "#{File.dirname(__FILE__)}/../data/template/recovery_facility.json"
    payload = JSON.load file_path
    payload['values'][0]['id'] = recovery_facility_id
    updated_payload_json = payload.to_json
    Log.info("template recovery details waste description payload #{updated_payload_json}")
    call_api('put', path, updated_payload_json)
  end
end
