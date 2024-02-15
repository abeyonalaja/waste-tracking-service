# frozen_string_literal: true

# this page is for shipping container details page details
class InlandWaterTransportDetailsPage < GenericPage
  include GeneralHelpers
  include ErrorBox

  TITLE = Translations.value 'exportJourney.wasteCarrierTransport.descriptionTitle'
  INTRO = Translations.value 'exportJourney.wasteCarrierTransport.descriptionHintIntro'
  BULLET1 = Translations.value 'exportJourney.wasteCarrierTransport.InlandWaterwaysBullet1'
  BULLET2 = Translations.value 'exportJourney.wasteCarrierTransport.InlandWaterwaysBullet2'
  BULLET3 = Translations.value 'exportJourney.wasteCarrierTransport.InlandWaterwaysBullet3'
  BULLET4 = Translations.value 'exportJourney.wasteCarrierTransport.InlandWaterwaysBullet4'
  BULLET5 = Translations.value 'exportJourney.wasteCarrierTransport.InlandWaterwaysBullet5'
  DETAILS = Translations.value 'exportJourney.wasteCarrierTransport.enterDetails'
  CAPTION = Translations.value 'exportJourney.wasteCarrierDetails.title'

  def check_page_displayed(carrier = 'first', type = 'inland waterways')
    expect(self).to have_css 'h1', text: TITLE.gsub!('{{carrierIndex}}', carrier).gsub!('{{type}}', type), exact_text: true
  end


  def check_translation
    expect(self).to have_text INTRO
    expect(self).to have_text BULLET1
    expect(self).to have_text BULLET2
    expect(self).to have_text BULLET3
    expect(self).to have_text BULLET4
    expect(self).to have_text BULLET5
    expect(self).to have_text CAPTION
  end

end
