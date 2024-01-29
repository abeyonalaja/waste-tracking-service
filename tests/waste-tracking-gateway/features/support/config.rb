# frozen_string_literal: true

# Used for BG tests
require_relative '../../lib/waste_tracking'
require 'json'
require 'test/unit'
require 'rspec/expectations'
require 'rspec/matchers'
require 'active_support/time'
require_relative 'env'
require 'active_support'
require 'date'
require 'time'
require 'faker'
require 'yaml'
require_relative '../../lib/methods/generic_page'
# for gem

# To stop execution at some point:
# binding.pry
# Allows the functions (assert_equals to work)
include Test::Unit::Assertions
