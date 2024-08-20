# frozen_string_literal: true

# Provides a way to happy path flow
module ExporterAddressManualController

  ADDRESS1 = '33 coldharbour'
  TOWN = 'London'
  POSTCODE = 'E14 9NS'
  COUNTRY = 'England'

  def self.complete
    exporter_address_manual_page = EnterExporterAddressManualPage.new
    exporter_address_manual_page.check_page_displayed
    exporter_address_manual_page.enter_address1 ADDRESS1
    exporter_address_manual_page.enter_town TOWN
    exporter_address_manual_page.enter_postcode POSTCODE
    exporter_address_manual_page.select_first_country_option

    TestStatus.set_test_status(:address1, ADDRESS1)
    TestStatus.set_test_status(:town, TOWN)
    TestStatus.set_test_status(:postcode, POSTCODE)
    TestStatus.set_test_status(:country, COUNTRY)
  end
end
