# frozen_string_literal: true

# Used for BG tests
require_relative '../../lib/waste_tracking'
require_relative 'env'
require 'active_support'
require 'date'
require 'time'
require 'capybara/cucumber'
require 'capybara-screenshot/cucumber'
require 'selenium/webdriver'
require 'faker'
require 'webdrivers'
require 'yaml'
require 'rspec/matchers'
require 'active_support/time'
require_relative '../../lib/methods/generic_page'


# To stop execution at some point:
# binding.pry
# Allows the functions (assert_equals to work)



World(Capybara::DSL)

Webdrivers.logger.level = :DEBUG

# Defaults
Capybara.default_selector = :id
Capybara.default_max_wait_time = 10
Capybara.automatic_label_click = true
# Capybara.app_host = 'http://localhost'

driver = ENV['DRIVER'] || :chrome
Capybara.default_driver = driver.to_sym
Capybara.javascript_driver = driver.to_sym

# Screenshot settings
Capybara::Screenshot.prune_strategy = { keep: 5 }

# Screenshot driver for :chrome
Capybara.save_path = './report/'
Capybara::Screenshot.register_driver(:chrome) do |driver, path|
  driver.browser.save_screenshot(path)
end

# Headless Chrome
Capybara.register_driver :chrome do |app|
  options = Selenium::WebDriver::Chrome::Options.new
  options.add_argument('--no-sandbox')
  # options.add_argument('--enable-features1=NetworkService,NetworkServiceInProcess')
  # options.add_argument('--headless')
  options.add_argument('--disable-gpu')
  options.add_argument('window-size=1920,1080')
  options.add_argument('--disable-dev-shm-usage')
  options.add_argument('ignore-certificate-errors')
  options.add_argument('--binary=../../chromedriver')

  Capybara::Selenium::Driver.new(app,
                                 browser: :chrome,
                                 capabilities: options)

end

Capybara.register_driver :remote_driver do |app|
  options = Selenium::WebDriver::Chrome::Options.new
  options.add_argument('no-sandbox')
  options.add_argument('--enable-features1=NetworkService,NetworkServiceInProcess')
  options.add_argument('headless')
  options.add_argument('disable-gpu')
  options.add_argument('--disable-dev-shm-usage')
  options.add_argument('window-size=1920,1080')
  options.add_argument('disable-dev-shm-usage')
  options.add_argument('ignore-certificate-errors')
  options.add_argument('--binary=../../chromedriver')

  # capabilities = Selenium::WebDriver::Remote::Capabilities.chrome(
  #   chromeOptions: { args: %w(disable-gpu no-sandbox,headless,disable-dev-shm-usage,ignore-certificate-errors,no-sandbox) }
  # )

  Capybara::Selenium::Driver.new(app,
                                 :browser => :chrome,
                                 # url: 'http://seleniumtestbss:4444/wd/hub',
                                 capabilities: options)
end

# # firefox
# Screenshot driver for :firefox
Capybara::Screenshot.register_driver(:firefox) do |driver, path|
  driver.browser.save_screenshot(path)
end

# Selenium::WebDriver::Firefox::Binary.path='Firefox.app/Contents/MacOS/firefox'

Capybara.register_driver :firefox do |app|
  capabilities = Selenium::WebDriver::Remote::Capabilities.firefox(
    acceptInsecureCerts: true,
    headless: true
  )
  browser_options = ::Selenium::WebDriver::Firefox::Options.new.tap do |opts|
    opts.add_argument '-headless'
  end
  Capybara::Selenium::Driver.new(app, **{ :browser => :firefox, desired_capabilities: capabilities, options: browser_options })
end

# this should prevent - Text file busy error
Webdrivers.install_dir = File.expand_path('~/.webdrivers/' + ENV['TEST_ENV_NUMBER'].to_s)

