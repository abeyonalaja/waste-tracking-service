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

  # Module for user login
  module Users
    def self.user_name(user)
      UserData.users.fetch(user).fetch(:userId)
    end

    def self.user_password(user)
      ENV['USER_PASSWORD'] || raise('Env variable is not available on the env ')
    end

    def self.user_business_name(user)
      UserData.users.fetch(user).fetch(:businessName)
    end

    def self.user_business_unit_id(user)
      UserData.users.fetch(user).fetch(:businessUnitId)
    end
  end

end
