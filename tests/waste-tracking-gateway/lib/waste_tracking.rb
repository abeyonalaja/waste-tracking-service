require_relative 'methods/operations'
require_relative 'test_environment'
require_relative 'methods/template_operations'
require_relative 'log'
require 'faker'

class WasteTracking
  include Operations
  include Log
  include TemplateOperations

  def initialize(region)
    @wts_env = TestEnvironment.new(region)
  end


end
