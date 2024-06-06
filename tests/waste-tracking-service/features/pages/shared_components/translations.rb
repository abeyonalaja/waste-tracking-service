# frozen_string_literal: true

require 'json'

# this file is to read from the json files
class Translations
  def self.key(value_to_find)
    if $translation_file == 'UKM'
      ukmv_key(value_to_find)
    else
      glw_key value_to_find
    end
  end

  def self.value(key_to_find)
    if $translation_file == 'UKM'
      ukmv_value(key_to_find)
    else
      glw_value key_to_find
    end
  end

  def self.glw_key(value_to_find)
    json_file_path = File.read(glw_file_path)
    data_hash = JSON.parse(json_file_path)
    data_hash.each do |key, value|
      return key if value == value_to_find
    end
  end

  def self.glw_value(key_to_find)
    json_file_path = File.read(glw_file_path)
    data_hash = JSON.parse(json_file_path)
    data_hash.each do |key, value|
      return value if key == key_to_find
    end
  end

  def self.glw_file_path
    File.open "#{File.dirname(__FILE__)}/../../support/config/GLW/en.json"
  end

  ##### UKMV translation

  def self.ukmv_value(key_path)
    json_file_path = File.read(ukmv_file_path)
    data = JSON.parse(json_file_path)
    keys = key_path.split('.')

    keys.each do |key|
      data = data[key]
      return nil unless data
    end

    data
  end

  def self.ukmv_key(value)
    json_file_path = File.read(ukmv_file_path)
    data = JSON.parse(json_file_path)

    # Define a lambda for the recursive function to find keys
    find_key = lambda do |data, value, path|
      case data
      when Hash
        data.each do |k, v|
          if v.is_a?(Hash) || v.is_a?(Array)
            result = find_key.call(v, value, path + [k])
            return result if result
          else
            return (path + [k]).join('.') if v == value
          end
        end
      when Array
        data.each_with_index do |item, index|
          result = find_key.call(item, value, path + [index])
          return result if result
        end
      end
      nil
    end

    # Call the lambda function to find key
    key = find_key.call(data, value, [])
    key

  end

  def self.ukmv_file_path
    File.open "#{File.dirname(__FILE__)}/../../support/config/UKMV/en.json"
  end

end

