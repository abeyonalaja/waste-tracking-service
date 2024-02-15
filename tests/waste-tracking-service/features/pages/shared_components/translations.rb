# frozen_string_literal: true

require 'json'

# this file is to read from the json files
class Translations
  def self.key(value_to_find)
    json_file_path = File.read(glw_file_path)
    data_hash = JSON.parse(json_file_path)
    data_hash.each do |key, value|
      return key if value == value_to_find
    end
  end

  def self.value(key_to_find)
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
    json_file_path = File.read(mv_file_path)
    data = JSON.parse(json_file_path)
    keys = key_path.split('.')

    keys.each do |key|
      data = data[key]
      return nil unless data 
    end

    data
  end

  def self.mv_file_path
    File.open "#{File.dirname(__FILE__)}/../../support/config/UKMV/en.json"
  end

end

