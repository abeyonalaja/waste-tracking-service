require 'yaml'
require 'selenium/webdriver'
require 'capybara/cucumber'
require 'browserstack/local'

TASK_ID = (ENV['TASK_ID'] || 0).to_i
CONFIG_NAME = ENV['CONFIG_NAME'] || 'single'

USER_NAME = ENV['BROWSERSTACK_USERNAME'] || 'spappula_6OcXAI'
ACCESS_KEY = ENV['BROWSERSTACK_ACCESS_KEY'] || 'imSyUqSoKAcd6x2juGz4'

CONFIG = YAML.load(File.read(File.join(File.dirname(__FILE__), "../../config/#{CONFIG_NAME}.config.yml")))
CONFIG['user'] = ENV['BROWSERSTACK_USERNAME'] || CONFIG['user']
CONFIG['key'] = ENV['BROWSERSTACK_ACCESS_KEY'] || CONFIG['key']

Capybara.register_driver :browserstack do |app|
  options = Selenium::WebDriver::Chrome::Options.new

  @bs_local = BrowserStack::Local.new
  bs_local_args = { 'key' => (CONFIG['key']).to_s }
  @bs_local.start(bs_local_args)

  Capybara::Selenium::Driver.new(app,
                                 browser: :remote,
                                 url: "https://#{CONFIG['user']}:#{CONFIG['key']}@#{CONFIG['server']}/wd/hub",
                                 options: options
  )
end

# Capybara.default_driver = :browserstack

# Code to stop browserstack local after end of test
at_exit do
  @bs_local.stop unless @bs_local.nil?
end
