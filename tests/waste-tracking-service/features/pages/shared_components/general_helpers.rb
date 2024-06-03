# frozen_string_literal: true

# Provides a way of continuing from one page to the next
module GeneralHelpers
  SAVE_AND_CONTINUE_BUTTON_TEXT ||= Translations.value 'saveButton'
  SAVE_AND_RETURN ||= Translations.value 'saveReturnButton'
  CONTINUE ||= Translations.value 'continueButton'
  FIND_ADDRESS ||= Translations.value 'postcode.findButton'
  BACK ||= Translations.value 'back'

  def save_and_continue
    click_button SAVE_AND_CONTINUE_BUTTON_TEXT
  end

  def save_and_return
    click_link SAVE_AND_RETURN
  end

  def continue
    click_button CONTINUE
  end

  def first_continue_button
    click_link(CONTINUE)
  end

  def find_address
    click_button FIND_ADDRESS
  end

  def back
    click_link BACK
  end

  def upload_file(file_type)
    raise "Unknown file type :#{file_type}." unless FileUploadHelper.file_exists?(file_type)

    file_path = FileUploadHelper.get_upload_file(file_type)
    attach_file('csvUpload', file_path)
  end

  def upload_with_filename(file_name)
    file_path = FileUploadHelper.ukm_filepath(file_name)
    attach_file('csvUpload', file_path)
  end

  def upload_file_data_row(data_row)
    file_path = FileUploadHelper.get_upload data_row
    attach_file('csvUpload', file_path)
  end

  def load_yaml(file_path)
    YAML.load_file(file_path)
  end

  def convert_keys_to_strings(hash)
    hash.each_with_object({}) do |(key, value), result|
      result[key.to_s] = value.is_a?(Hash) ? convert_keys_to_strings(value) : value
    end
  end

  def compare_data(yaml_data, json_data)
    all_ok = true

    yaml_data.each do |key, yaml_errors|
      if json_data.key?(key)
        json_errors = json_data[key]
        yaml_errors.each_with_index do |yaml_error, index|
          json_error = json_errors[index]
          yaml_error_string_keys = convert_keys_to_strings(yaml_error)
          if yaml_error_string_keys != json_error
            all_ok = false
            puts "Difference found in '#{key}' at row #{yaml_error[:row_number]}:"
            puts "YAML: #{yaml_error_string_keys}"
            puts "JSON: #{json_error}"
          end
        end
      else
        all_ok = false
        puts "Key '#{key}' not found in JSON data."
      end
    end

    all_ok
  end

  def convert_to_json(ruby_hash)
    stringified_hash = ruby_hash.transform_keys(&:to_s)
    stringified_hash.each do |key, value|
      if value.is_a?(Array)
        value.each do |item|
          item.transform_keys!(&:to_s) if item.is_a?(Hash)
        end
      end
    end
    JSON.pretty_generate(stringified_hash)
  end

  def parse_json(json_string)
    JSON.parse(json_string)
  end
end
