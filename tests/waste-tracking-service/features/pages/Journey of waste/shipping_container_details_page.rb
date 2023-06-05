# frozen_string_literal: true

require_relative '../shared_components/general_helpers'
require_relative '../shared_components/error_box'
# this page is for shipping container details page details
class ShippingContainerDetailsPage < GenericPage
  include GeneralHelpers
  include ErrorBox

  TITLE = Translations.value 'exportJourney.wasteCarrier.shippingContainer.title'
  EDIT_MESSAGE = Translations.value 'exportJourney.wasteCarrier.YouCanEditMessage'
  SHIPPING_CONTAINER_NUMBER = Translations.value 'exportJourney.wasteCarrier.shippingContainer.containerNumberMessage'
  SHIPPING_CONTAINER_NUMBER_HINT = Translations.value 'exportJourney.wasteCarrier.shippingContainer.containerNumberHint'
  VEHICLE_REG = Translations.value 'exportJourney.wasteCarrier.shippingContainer.vehicleReg'
  VEHICLE_REG_HINT = Translations.value 'exportJourney.wasteCarrier.shippingContainer.vehicleRegHint'

  SHIPPING_NUMBER_FILED_ID = 'shippingContainerNumber'
  def check_page_displayed
    # expect(self).to have_css 'h1', text: TITLE, exact_text: true
    expect(self).to have_css 'h1', text: 'Shipping container details', exact_text: true
  end

  def check_translation
    expect(self).to have_text EDIT_MESSAGE
    expect(self).to have_text SHIPPING_CONTAINER_NUMBER
    expect(self).to have_text SHIPPING_CONTAINER_NUMBER_HINT
    expect(self).to have_text VEHICLE_REG
    expect(self).to have_text VEHICLE_REG_HINT
  end

  def enter_container_number(container_number)
    fill_in SHIPPING_NUMBER_FILED_ID, with: container_number, visible: false
    TestStatus.set_test_status(:container_number, container_number)
  end

  def has_reference_container_num?(location)
    find(SHIPPING_NUMBER_FILED_ID).value == location
  end
end
