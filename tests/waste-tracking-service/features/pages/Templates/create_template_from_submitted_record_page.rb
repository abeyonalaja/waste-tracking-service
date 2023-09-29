# frozen_string_literal: true

require_relative '../shared_components/general_helpers'
require_relative '../shared_components/error_box'
# this page is create template from submitted record page details
class CreateTemplateFromSubmittedRecordPage < GenericPage
  include GeneralHelpers
  include ErrorBox

  TITLE = Translations.value 'templates.create.fromRecord.title'
  CREATE_BUTTON = Translations.value 'templates.create.createButton'

  TEMPLATE_NAME_FIELD_ID = 'templateName'
  DESCRIPTION_FIELD_ID = 'templateDesc'

  def check_page_displayed
    expect(self).to have_css 'h1', text: TITLE, exact_text: true
  end

  def enter_template_name(template_name)
    fill_in TEMPLATE_NAME_FIELD_ID, with: template_name, visible: false
    TestStatus.set_test_status(:template_name, template_name)
  end

  def enter_description(template_description)
    fill_in DESCRIPTION_FIELD_ID, with: template_description, visible: false
    TestStatus.set_test_status(:template_description, template_description)
  end

  def create_template_button
    click_button CREATE_BUTTON
  end

end
