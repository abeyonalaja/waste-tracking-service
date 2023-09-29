# frozen_string_literal: true

# Used for BG tests
require_relative '../../lib/waste_tracking'

require 'json'
require 'test/unit'
require 'rspec/expectations'
require 'rspec/matchers'
require 'active_support/time'
# for gem

# To stop execution at some point:
# binding.pry
# Allows the functions (assert_equals to work)
include Test::Unit::Assertions
