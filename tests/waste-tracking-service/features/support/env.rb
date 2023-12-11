
class Env
  def self.start_page_url
    (ENV['START_PAGE_URL']) || 'http://localhost:4200/'
  end

  def self.start_shutter_pages_url(page_code)
    "#{Env.start_page_url}/#{page_code}"
  end

  def self.export_pdf_url(id)
    "#{Env.start_page_url}/export/submitted/download?id=#{id}"
  end

end

#
# AllureCucumber.configure do |config|
#   config.results_directory = "report/allure-results"
#   config.clean_results_directory = true
#   config.logging_level = Logger::INFO
#   config.logger = Logger.new($stdout, Logger::DEBUG)
#   config.environment = "dev"
#
#   # additional metadata
#   # environment.properties
#   config.environment_properties = {
#     Test_Environment: "dev"
#   }
# end
#
# Allure.add_attachment(name: "attachment", source: "Some string", type: Allure::ContentType::TXT, test_case: true)
