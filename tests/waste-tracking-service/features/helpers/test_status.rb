# frozen_string_literal: true

# Module to collect the data used in the test scenarios
module TestStatus

  @test_status = {}
  @countries_waste_will_travel = []
  @waste_carrier_org_details = []
  @waste_carrier_titles = []

  def self.set_test_status(key, value)
    @test_status[key] = value
  end

  def self.reset_test_status
    @test_status = {}
    @countries_waste_will_travel = []
    @waste_carrier_org_details = []
    @waste_carrier_titles = []
  end

  def self.test_status(key = 'all')
    if key.eql?('all')
      @test_status['countries_list'] = @countries_waste_will_travel
      @test_status['waste_carrier_org_details'] = @waste_carrier_org_details
      @test_status['waste_carrier_titles'] = @waste_carrier_titles
      @test_status
    else
      @test_status[key.to_sym]
    end
  end

  def self.countries_waste_will_travel(country)
    @countries_waste_will_travel.push(country)
  end

  def self.countries_list
    @countries_waste_will_travel
  end

  def self.waste_carrier_org_details(waste_carrier)
    @waste_carrier_org_details.push(waste_carrier)
  end

  def self.waste_carrier_org_detail
    @waste_carrier_org_details
  end

  def self.waste_carrier_titles(waste_carrier_titles)
    @waste_carrier_titles.push(waste_carrier_titles)
  end

  def self.waste_carrier_title
    @waste_carrier_titles
  end

  def self.recovery_facilities(facility)
    @recovery_facilities.push(facility)
  end

  def self.recovery_facility
    @recovery_facilities
  end

end
