require 'allure-cucumber'

class Env
  def self.start_page_url
    (ENV['START_PAGE_URL']) || 'http://localhost:4200'
  end

end

AllureCucumber.configure do |config|
  config.results_directory = "/Allure_results"
  config.clean_results_directory = true
  config.logging_level = Logger::INFO
  config.logger = Logger.new($stdin, Logger::DEBUG)
  config.environment = 'Test'

end

