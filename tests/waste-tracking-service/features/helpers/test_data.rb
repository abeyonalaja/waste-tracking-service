# frozen_string_literal: true
require 'yaml'

# Module is for ruby methods
module TestData
  def self.ewc_codes
    %w[010101 010102 010304 010305 010306 010307 020702 020703 020704]
  end

  def self.get_ewc_codes(no_of_codes)
    ewc_codes.fetch no_of_codes
  end

  def self.get_ewc_code_description code
    xyz = YAML.load_file('features/data/ewc_code.yml')
    code = xyz.find { |entry| entry['code'].to_s == code }
    code['description']
  end

  def self.load_ewc_code_data
    YAML.load_file('features/data/ewc_code.yml')
  end

end
