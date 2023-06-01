# frozen_string_literal: true

# Module to collect the data used in the test scenarios
module TestStatus

  @test_status = {}
  @countries_waste_will_travel = []

  def self.set_test_status(key, value)
    @test_status[key] = value
  end

  def self.reset_test_status
    @test_status = {}
    @countries_waste_will_travel=[]
  end

  def self.test_status(key = 'all')
    if key.eql?('all')
      @test_status
      @test_status['countries_list'] = @countries_waste_will_travel
    end
    @test_status[key.to_sym]
  end

  def self.countries_waste_will_travel(country)
    @countries_waste_will_travel.push(country)
  end

  def self.countries_list
    @countries_waste_will_travel
  end
end
