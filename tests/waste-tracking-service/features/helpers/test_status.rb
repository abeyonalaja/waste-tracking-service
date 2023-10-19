# frozen_string_literal: true

# Module to collect the data used in the test scenarios
module TestStatus

  @test_status = {}
  @countries_waste_will_travel = []
  @waste_carrier_org_details = []
  @waste_carrier_titles = []
  @waste_carrier_addresses = []
  @ewc_codes = []
  @waste_mode_of_travel = []

  def self.set_test_status(key, value)
    @test_status[key] = value
  end

  def self.reset_test_status
    @test_status = {}
    @countries_waste_will_travel = []
    @waste_carrier_org_details = []
    @waste_carrier_titles = []
    @waste_carrier_addresses = []
    @ewc_codes = []
    @waste_mode_of_travel = []
  end

  def self.test_status(key = 'all')
    if key.eql?('all')
      @test_status['countries_list'] = @countries_waste_will_travel
      @test_status['waste_carrier_org_details'] = @waste_carrier_org_details
      @test_status['waste_carrier_titles'] = @waste_carrier_titles
      @test_status['waste_carrier_address'] = @waste_carrier_addresses
      @test_status['ewc_codes'] = @ewc_codes
      @test_status['waste_mode_of_travel'] = @waste_mode_of_travel
      @test_status
    else
      @test_status[key.to_sym]
    end
  end

  def self.mode_of_travel_list(mode_of_travel)
    @waste_mode_of_travel.push(mode_of_travel)
  end

  def self.mode_of_travel_list_details
    @waste_mode_of_travel
  end

  def self.ewc_codes(ewc_code)
    @ewc_codes.push(ewc_code)
  end

  def self.ewc_code_list
    @ewc_codes
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

  def self.waste_carrier_addresses(address)
    @waste_carrier_addresses.push(address)
  end

  def self.waste_carrier_address
    @waste_carrier_addresses
  end

  def self.recovery_facilities(facility)
    @recovery_facilities.push(facility)
  end

  def self.recovery_facility
    @recovery_facilities
  end

end
