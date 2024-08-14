# frozen_string_literal: true

# this page is for Source Of The Waste page
class SourceOfTheWastePage < GenericPage
  include CommonComponents
  include PageHelper
  include ErrorBox

  TITLE = Translations.ukmv_value 'single.producer.sourceOfWaste.heading'
  CAPTION = Translations.ukmv_value 'single.producer.sourceOfWaste.caption'
  RADIO_ONE = Translations.ukmv_value 'single.producer.sourceOfWaste.radioOne'
  RADIO_TWO = Translations.ukmv_value 'single.producer.sourceOfWaste.radioTwo'
  RADIO_THREE = Translations.ukmv_value 'single.producer.sourceOfWaste.radioThree'
  RADIO_FOUR = Translations.ukmv_value 'single.producer.sourceOfWaste.radioFour'

  def check_page_displayed
    expect(self).to have_css 'h1', text: TITLE, exact_text: true
  end

  def check_page_translation
    expect(self).to have_text CAPTION
    expect(self).to have_text RADIO_ONE
    expect(self).to have_text RADIO_TWO
    expect(self).to have_text RADIO_THREE
    expect(self).to have_text RADIO_FOUR
  end

  def option_checked?(selected_option)
    find(source_option_selected.fetch(selected_option), visible: false).checked?
  end

  def source_option_selected
    {
      'Commercial waste' => 'waste-source-radio-1',
      'Industrial waste' => 'waste-source-radio-2',
      'Construction and demolition waste' => 'waste-source-radio-3',
      'Household waste' => 'waste-source-radio-4'
    }
  end

end
