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

  # config.environment_properties = {
  #   Test_Environment: "Dev"
  # }

  # config.categories = File.new('categories/cat.json')
end

# Cucumber::Core::Test::Step.module_eval do
#   def name
#     return text if self.text == 'Before hook'
#     return text if self.text == 'After hook'
#     "#{source.last.keyword}#{text}"
#   end
# end
