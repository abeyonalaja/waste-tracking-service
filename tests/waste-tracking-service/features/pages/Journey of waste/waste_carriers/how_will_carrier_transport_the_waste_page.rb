# frozen_string_literal: true

require_relative '../../shared_components/general_helpers'
require_relative '../../shared_components/error_box'
# this page is for How will carrier transport the waste page details
class HowWillTheWasteCarrierTransportTheWastePage < GenericPage
  include GeneralHelpers
  include ErrorBox
  include PageHelper

  TITLE = Translations.value 'exportJourney.wasteCarrierTransport.pageQuestion'
  ROAD_OPTION = Translations.value 'exportJourney.wasteCarrierTransport.Road'
  SEA_OPTION = Translations.value 'exportJourney.wasteCarrierTransport.Sea'
  AIR_OPTION = Translations.value 'exportJourney.wasteCarrierTransport.Air'
  RAIL_OPTION = Translations.value 'exportJourney.wasteCarrierTransport.Rail'
  WATER_OPTION = Translations.value 'exportJourney.wasteCarrierTransport.InlandWaterways'
  CAPTION = Translations.value 'exportJourney.wasteCarrierDetails.title'

  def check_page_displayed(carrier = 'first')
    expect(self).to have_css 'h1', text: TITLE.gsub!('{{carrierIndex}}', carrier), exact_text: true
    # expect(self).to have_css 'h1', text: 'How will the waste carrier transport the waste?', exact_text: true
  end

  def check_translation
    expect(self).to have_text SEA_OPTION
    expect(self).to have_text AIR_OPTION
    expect(self).to have_text RAIL_OPTION
    expect(self).to have_text ROAD_OPTION
    expect(self).to have_text WATER_OPTION
    expect(self).to have_text CAPTION
  end

  def option_checked?(selected_option)
    find(transport_options.fetch(selected_option), visible: false).checked?
  end

  def transport_options
    {
      'Road' => 'transportTypeRoad',
      'Sea' => 'transportTypeSea',
      'Air' => 'transportTypeAir',
      'Rail' => 'transportTypeRail',
      'Inland waterways' => 'transportTypeWater'
    }
  end
end
