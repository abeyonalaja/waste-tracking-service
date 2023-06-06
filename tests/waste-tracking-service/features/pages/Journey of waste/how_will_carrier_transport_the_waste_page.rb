# frozen_string_literal: true

require_relative '../shared_components/general_helpers'
require_relative '../shared_components/error_box'
# this page is for How will carrier transport the waste page details
class HowWillTheWasteCarrierTransportTheWastePage < GenericPage
  include GeneralHelpers
  include ErrorBox
  include PageHelper

  SHIPPING_CONTAINER_OPTION = Translations.value 'exportJourney.wasteCarrierTransport.optionOne'
  TRAILER_OPTION = Translations.value 'exportJourney.wasteCarrierTransport.optionTwo'
  BULK_VESSEL_OPTION = Translations.value 'exportJourney.wasteCarrierTransport.optionThree'
  def check_page_displayed
    # expect(self).to have_css 'h1', text: TITLE, exact_text: true
    expect(self).to have_css 'h1', text: 'How will the waste carrier transport the waste?', exact_text: true
  end

  def check_translation
    expect(self).to have_text SHIPPING_CONTAINER_OPTION
    expect(self).to have_text TRAILER_OPTION
    expect(self).to have_text BULK_VESSEL_OPTION
  end

  def option_checked?(selected_option)
    find(transport_options.fetch(selected_option), visible: false).checked?
  end

  def transport_options
    {
      'Shipping container' => 'ShippingContainer',
      'Trailer' => 'Trailer',
      'Bulk vessel' => 'BulkVessel'
    }
  end
end
