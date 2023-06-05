# frozen_string_literal: true

require_relative '../shared_components/general_helpers'
require_relative '../shared_components/error_box'
# this page is for trailer details page details
class BulkVesselDetailsPage < GenericPage
  include GeneralHelpers
  include ErrorBox

  TITLE = Translations.value 'exportJourney.wasteCarrier.bulkVessel.title'
  EDIT_MESSAGE = Translations.value 'exportJourney.wasteCarrier.bulkVessel.YouCanEditMessage'
  IMO_NUMBER = Translations.value 'exportJourney.wasteCarrier.bulkVessel.imo'

  IMO_FILED_ID = 'imo'
  def check_page_displayed
    # expect(self).to have_css 'h1', text: TITLE, exact_text: true
    expect(self).to have_css 'h1', text: 'Bulk vessel details', exact_text: true
  end

  def check_translation
    expect(self).to have_text EDIT_MESSAGE
    expect(self).to have_text IMO_NUMBER
  end

  def enter_imo_number(imo_number)
    fill_in IMO_FILED_ID, with: imo_number, visible: false
    TestStatus.set_test_status(:container_number, imo_number)
  end

  def has_reference_imo_number?(imo_number)
    find(IMO_FILED_ID).value == imo_number
  end
end
