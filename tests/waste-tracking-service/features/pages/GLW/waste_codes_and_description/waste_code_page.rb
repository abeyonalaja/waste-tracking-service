# this page is for Add Reference Number page details
class WasteCodePage < GenericPage
  include GeneralHelpers
  include ErrorBox
  include PageHelper

  WASTE_CODE_BASEL_ANNEX_IX_CODE = 'WasteCode'

  TITLE = Translations.value 'exportJourney.wasteCodesDescription.title'
  PARAGRAPH = Translations.value 'exportJourney.wasteCodesDescription.paragraph'
  LINK_TEXT = Translations.value 'exportJourney.wasteCodesDescription.link'
  AUTO_HINT = Translations.value 'autocompleteHint'

  def check_page_displayed(waste_code)
    expect(self).to have_css 'h1', text: TITLE.gsub('{{ wc }}', waste_code), exact_text: true
  end

  def check_translation
    expect(self).to have_text PARAGRAPH
    expect(self).to have_link LINK_TEXT
    expect(self).to have_link AUTO_HINT
  end

  def select_first_option
    first('WasteCode', minimum: 1).click
    first('WasteCode__option--0', minimum: 1).select_option
    TestStatus.set_test_status(:waste_code_description, first('WasteCode').value)
  end

  def has_waste_code?(reference)
    # puts find(WASTE_CODE_BASEL_ANNEX_IX_CODE, visible: false).checked?
    find(WASTE_CODE_BASEL_ANNEX_IX_CODE, visible: false).value == reference
  end

end
