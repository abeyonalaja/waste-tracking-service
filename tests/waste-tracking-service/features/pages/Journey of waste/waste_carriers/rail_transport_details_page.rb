# frozen_string_literal: true

require_relative '../../shared_components/general_helpers'
require_relative '../../shared_components/error_box'
# this page is for shipping container details page details
class RailTransportDetailsPage < GenericPage
  include GeneralHelpers
  include ErrorBox

  TITLE = Translations.value 'exportJourney.wasteCarrierTransport.descriptionTitle'
  INTRO = Translations.value 'exportJourney.wasteCarrierTransport.descriptionHintIntro'
  BULLET1 = Translations.value 'exportJourney.wasteCarrierTransport.RailBullet1'
  BULLET2 = Translations.value 'exportJourney.wasteCarrierTransport.RailBullet2'
  BULLET3 = Translations.value 'exportJourney.wasteCarrierTransport.RailBullet4'
  DETAILS = Translations.value 'exportJourney.wasteCarrierTransport.enterDetails'
  CAPTION = Translations.value 'exportJourney.wasteCarrierDetails.title'

  def check_page_displayed(carrier = 'first', type = 'rail')
    expect(self).to have_css 'h1', text: TITLE.gsub!('{{carrierIndex}}', carrier).gsub!('{{type}}', type), exact_text: true
  end

  def check_translation
    expect(self).to have_text INTRO
    expect(self).to have_text BULLET1
    expect(self).to have_text BULLET2
    expect(self).to have_text BULLET3
    expect(self).to have_text CAPTION
  end

end
