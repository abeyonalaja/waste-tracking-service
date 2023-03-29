# frozen_string_literal: true

# this page is for handling different environments
class TestEnvironment
  REGION_ERROR = 'Unknown region'
  attr_accessor :url


  def initialize(region)
    @url = test_regions(region)
  end

  def test_regions(region)
    url={}
    case region.upcase
    when 'Local'
      url['submission'] = "https://#{region.downcase}"
    end
  end
end
