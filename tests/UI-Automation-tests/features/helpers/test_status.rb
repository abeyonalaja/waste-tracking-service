# frozen_string_literal: true

# Module to collect the data used in the test scenarios
module TestStatus

  @test_status = {}

  def self.set_test_status(key, value)
    @test_status[key] = value
  end

  def self.reset_test_status
    @test_status = {}
  end

  def self.test_status(key = 'all')
    if key.eql?('all')
      @test_status
    end
    @test_status[key.to_sym]
  end
end
