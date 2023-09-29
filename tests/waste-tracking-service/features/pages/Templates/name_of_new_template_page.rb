# frozen_string_literal: true

require_relative '../shared_components/general_helpers'
require_relative '../shared_components/error_box'
# this page is update template name page details
class NameOfTheNewTemplatePage < GenericPage
  include GeneralHelpers
  include ErrorBox

  TITLE = Translations.value 'templates.copy.title'
  CAPTION = Translations.value 'templates.copy.caption'
  INTRO = Translations.value 'templates.copy.intro'
  CREATE_BUTTON = Translations.value 'templates.copy.createButton'
  CANCEL_BUTTON = Translations.value 'templates.copy.cancelButton'

  TEMPLATE_NAME_FIELD_ID = 'templateName'
  DESCRIPTION_FIELD_ID = 'templateDesc'

  def check_page_displayed
    expect(self).to have_css 'h1', text: TITLE, exact_text: true
  end

  def check_page_translation
    expect(self).to have_text TITLE
    expect(self).to have_text INTRO
    expect(self).to have_text CAPTION
  end

  def enter_copy_template_name(copy_template_name)
    fill_in TEMPLATE_NAME_FIELD_ID, with: copy_template_name, visible: false
    TestStatus.set_test_status(:copy_template_name, copy_template_name)
  end

  def enter_copy_description(copy_template_description)
    fill_in DESCRIPTION_FIELD_ID, with: copy_template_description, visible: false
    TestStatus.set_test_status(:copy_template_description, copy_template_description)
  end

  def create_template_button
    click_button CREATE_BUTTON
  end

  def find_copied_banner_body
    find('template-tasklist-banner-copied_body')
  end
end
