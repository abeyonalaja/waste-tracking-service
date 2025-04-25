# frozen_string_literal: true

# this page is for Add Reference Number page details
class ClassificationOfTheWastePage < GenericPage
  include GeneralHelpers
  include ErrorBox
  include PageHelper

  WASTE_CODE_BASEL_ANNEX_IX_CODE = 'WasteCode'

  TITLE = Translations.value 'exportJourney.whatsTheWasteCode.title'
  HINT = Translations.value 'exportJourney.whatsTheWasteCode.naHint'
  CAPTION = Translations.value 'exportJourney.wasteCodesAndDesc.caption'

  def check_page_displayed
    expect(self).to have_css 'h1', text: TITLE, exact_text: true
  end

  def check_translation
    expect(self).to have_text HINT
    expect(self).to have_text CAPTION
  end

  def waste_code_option(option)
    find(waste_code_options.fetch(option), visible: all)
  end

  def select_second_BaselAnnexIX_option
    fill_in 'WasteCode', with: ''
    first('WasteCode', minimum: 1).click
    first('WasteCode__option--1', minimum: 1).select_option
    TestStatus.set_test_status(:waste_code_description, first('WasteCode').value)
  end

  def select_first_OECD_option
    first('WasteCode', minimum: 1).click
    first('WasteCode__option--0', minimum: 1).select_option
    TestStatus.set_test_status(:waste_code_description, first('WasteCode').value)
  end

  def waste_code_options
    {
      'Basel Annex IX' => 'wasteCodeCategoryBaselAnnexIX',
      'OECD' => 'wasteCodeCategoryBaselOECD',
      'Annex IIIA' => 'wasteCodeCategoryAnnexIIIA',
      'Annex IIIB' => 'wasteCodeCategoryAnnexIIIB',
      'Not applicable' => 'wasteCodeCategoryNA'
    }
  end

end
