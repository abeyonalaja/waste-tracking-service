# frozen_string_literal: true

# this page is for ukwm Add Reference page
class UkwmAddReferencePage < GenericPage
  include GeneralHelpers
  include ErrorBox

  TITLE = Translations.ukmv_value 'single.uniqueReference.title'
  CAPTION = Translations.ukmv_value 'single.uniqueReference.caption'
  DESCRIPTION = Translations.ukmv_value 'single.uniqueReference.description'
  TEXT = Translations.ukmv_value 'single.uniqueReference.allowed.text'
  ITEM1 = Translations.ukmv_value 'single.uniqueReference.allowed.itemOne'
  ITEM2 = Translations.ukmv_value 'single.uniqueReference.allowed.itemTwo'
  ITEM3 = Translations.ukmv_value 'single.uniqueReference.allowed.itemThree'
  ITEM4 = Translations.ukmv_value 'single.uniqueReference.allowed.itemFour'
  ITEM5 = Translations.ukmv_value 'single.uniqueReference.allowed.itemFive'
  ITEM6 = Translations.ukmv_value 'single.uniqueReference.allowed.itemSix'
  EXAMPLE = Translations.ukmv_value 'single.uniqueReference.example'
  REFERENCE_FIELD_ID = 'unique-reference'

  def check_page_displayed
    expect(self).to have_css 'h1', text: TITLE, exact_text: true
  end

  def check_page_translation
    expect(self).to have_text CAPTION
    expect(self).to have_text DESCRIPTION
    expect(self).to have_text TEXT
    expect(self).to have_text ITEM1
    expect(self).to have_text ITEM2
    expect(self).to have_text ITEM3
    expect(self).to have_text ITEM4
    expect(self).to have_text ITEM5
    expect(self).to have_text ITEM6
    expect(self).to have_text EXAMPLE
  end

  def enter_reference(reference)
    fill_in REFERENCE_FIELD_ID, with: reference, visible: false
  end

  def current_url
    page.current_url
  end
end
