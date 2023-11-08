# frozen_string_literal: true

require_relative '../../shared_components/general_helpers'
require_relative '../../shared_components/error_box'
# this page is for shipping container details page details
class RoadTransportDetailsPage < GenericPage
  include GeneralHelpers
  include ErrorBox


  INTRO = Translations.value 'exportJourney.wasteCarrierTransport.descriptionHintIntro'
  BULLET1 = Translations.value 'exportJourney.wasteCarrierTransport.RoadBullet1'
  BULLET2 = Translations.value 'exportJourney.wasteCarrierTransport.RoadBullet2'
  BULLET3 = Translations.value 'exportJourney.wasteCarrierTransport.RoadBullet3'
  BULLET4 = Translations.value 'exportJourney.wasteCarrierTransport.RoadBullet4'
  DETAILS = Translations.value 'exportJourney.wasteCarrierTransport.enterDetails'
  CAPTION = Translations.value 'exportJourney.wasteCarrierDetails.title'

  def check_page_displayed(carrier = 'first', type = 'road')
    title = Translations.value 'exportJourney.wasteCarrierTransport.descriptionTitle'
    expect(self).to have_css 'h1', text: title.gsub!('{{carrierIndex}}', carrier).gsub!('{{type}}', type), exact_text: true
  end

  def check_translation
    expect(self).to have_text INTRO
    expect(self).to have_text BULLET1
    expect(self).to have_text BULLET2
    expect(self).to have_text BULLET3
    expect(self).to have_text BULLET4
    expect(self).to have_text CAPTION
  end

  DESCRIPTION_FILED_ID = 'description'
  def enter_transportation_description(road_description)
    fill_in DESCRIPTION_FILED_ID, with: road_description, visible: false
    TestStatus.set_test_status(:road_description, road_description)
  end

end
