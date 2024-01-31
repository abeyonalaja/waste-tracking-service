# frozen_string_literal: true

require_relative 'shared_components/general_helpers'
require_relative 'shared_components/error_box'
# this page is for Add Reference Number page details
class AddReferenceNumberPage < GenericPage
  include GeneralHelpers
  include ErrorBox

  REFERENCE_NUMBER_INPUT_ID = 'reference'
  TITLE = Translations.value 'yourReference.title'
  INTRO = Translations.value 'yourReference.intro'
  YOUR_REFERENCE = Translations.value 'yourReference.breadcrumb'
  PARAGRAPH = Translations.value 'yourReference.intro.second.paragraph'
  APP_TITLE = Translations.value 'app.title'
  PARENT_TITLE = Translations.value 'app.parentTitle'
  SINGLE_EXPORT_TITLE = Translations.value 'exportJourney.submitAnExport.breadcrumb'
  INPUT_LABEL = Translations.value 'yourReference.inputLabel'

  def check_page_displayed
    expect(self).to have_css 'h1', text: TITLE, exact_text: true
  end

  def check_page_translation
    expect(self).to have_text PARAGRAPH
    expect(self).to have_text INTRO
    expect(self).to have_text INPUT_LABEL
  end

  def choose_option option
    choose(option, visible: false)
  end

  def enter_reference_number(reference)
    fill_in REFERENCE_NUMBER_INPUT_ID, with: reference, visible: false
  end

  def has_reference?(reference)
    find(REFERENCE_NUMBER_INPUT_ID).value == reference
  end

  def current_url
    page.current_url
  end

  def export_waste_from_the_uk
    link = all(:link, text: 'Export waste from the UK').last
    link.click
  end

  def check_bread_crumbs_translation
    expect(self).to have_text YOUR_REFERENCE
    expect(self).to have_text APP_TITLE
    expect(self).to have_text PARENT_TITLE
    expect(self).to have_text SINGLE_EXPORT_TITLE
  end
end
