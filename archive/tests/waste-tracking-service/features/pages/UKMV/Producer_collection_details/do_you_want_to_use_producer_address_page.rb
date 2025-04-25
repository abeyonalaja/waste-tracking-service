# frozen_string_literal: true

# this page is for whats producer address page
class DoYouWantToUseProducerAddressPage < GenericPage
  include CommonComponents
  include GeneralHelpers
  include ErrorBox
  include PageHelper

  TITLE = Translations.ukmv_value 'wasteCollectionDetails.sameAsProducer.prompt.heading'
  CAPTION = Translations.ukmv_value 'wasteCollectionDetails.sameAsProducer.prompt.caption'
  INTRO = Translations.ukmv_value 'wasteCollectionDetails.sameAsProducer.prompt.paragraphOne'
  RADIO_1 = Translations.ukmv_value 'wasteCollectionDetails.sameAsProducer.prompt.radioOne'
  RADIO_2 = Translations.ukmv_value 'wasteCollectionDetails.sameAsProducer.prompt.radioTwo'

  def check_page_displayed
    expect(self).to have_css 'h1', text: TITLE, exact_text: true
  end

  def check_page_translation
    expect(self).to have_text CAPTION
    expect(self).to have_text INTRO
    expect(self).to have_text RADIO_1
    expect(self).to have_text RADIO_2
  end



end
