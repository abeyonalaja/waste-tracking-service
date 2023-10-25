# frozen_string_literal: true

require 'json'

# this file is to read from the json files
class Translations
  def self.key(value_to_find)
    json_file_path = File.read(file_path)
    data_hash = JSON.parse(json_file_path)
    data_hash.each do |key, value|
      return key if value == value_to_find
    end
  end

  def self.value(key_to_find)
    json_file_path = File.read(file_path)
    data_hash = JSON.parse(json_file_path)
    data_hash.each do |key, value|
      return value if key == key_to_find
    end
  end

  def self.file_path
    File.open "#{File.dirname(__FILE__)}/../../support/config/en.json"
  end
end

