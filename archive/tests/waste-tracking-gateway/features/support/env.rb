# frozen_string_literal: true

LOCAL = { local: 'http://localhost:3000' }.freeze

# Methods relating to the env details
class Env
  def self.host_url
    (ENV['START_PAGE_URL']) || 'https://track-waste-tst.azure.defra.cloud'
  end

  def self.app_page_url
    (ENV['START_PAGE_URL']) || 'https://track-waste-tst.azure.defra.cloud'
  end

  def self.test_env
    ENV['ENVIRONMENT'] || 'LOCAL'
  end

end
