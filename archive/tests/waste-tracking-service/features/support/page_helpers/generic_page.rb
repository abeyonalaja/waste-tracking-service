require 'rspec/expectations'
require 'capybara/cucumber'

class GenericPage
  include RSpec::Matchers
  include Capybara::DSL
  include Capybara::RSpecMatchers
end
