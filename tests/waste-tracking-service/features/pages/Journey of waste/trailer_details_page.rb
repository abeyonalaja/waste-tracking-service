# frozen_string_literal: true

require_relative '../shared_components/general_helpers'
require_relative '../shared_components/error_box'
# this page is for trailer details page details
class TrailerDetailsPage < GenericPage
  include GeneralHelpers
  include ErrorBox

  TITLE = Translations.value 'exportJourney.wasteCarrier.trailer.title'
  EDIT_MESSAGE = Translations.value 'exportJourney.wasteCarrier.trailer.YouCanEditMessage'
  TRAIL_NUMBER = Translations.value 'exportJourney.wasteCarrier.trailer.trailerNumber'
  VEHICLE_REG = Translations.value 'exportJourney.wasteCarrier.trailer.vehicleReg'

  VEHICLE_REG_FILED_ID = 'vehicleRegistration'
  def check_page_displayed
    # expect(self).to have_css 'h1', text: TITLE, exact_text: true
    expect(self).to have_css 'h1', text: 'Trailer details', exact_text: true
  end

  def check_translation
    expect(self).to have_text EDIT_MESSAGE
    expect(self).to have_text TRAIL_NUMBER
    expect(self).to have_text VEHICLE_REG
  end

  def enter_vehicle_number(vehicle_number)
    fill_in VEHICLE_REG_FILED_ID, with: vehicle_number, visible: false
    TestStatus.set_test_status(:container_number, vehicle_number)
  end

  def has_reference_vehicle_num?(vehicle_number)
    find(VEHICLE_REG_FILED_ID).value == vehicle_number
  end
end
