# frozen_string_literal: true

require 'json'

# this file is to read from the json files
class Translations
  def self.key(value_to_find)
    json_file_path = File.read('features/support/config/en.json')
    data_hash = JSON.parse(json_file_path)
    data_hash.each do |key, value|
      return key if value == value_to_find
    end
    # If the value is not found, return nil
    nil
  end

  def self.value(key_to_find)
    json_file_path = File.read('features/support/config/en.json')
    data_hash = JSON.parse(json_file_path)
    data_hash.each do |key, value|
      return value if key == key_to_find
    end

    # If the value is not found, return nil
    nil
  end
end

