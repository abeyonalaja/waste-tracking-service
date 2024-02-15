# frozen_string_literal: true

# this page is update template name page details
class UpdateTemplateNamePage < GenericPage
  include GeneralHelpers
  include ErrorBox

  TITLE = Translations.value 'templates.nameAndDesc.title'
  LABEL = Translations.value 'templates.taskList.nameAndDescription'
  UPDATE_BUTTON = Translations.value 'templates.nameAndDesc.updateButton'

  TEMPLATE_NAME_FIELD_ID = 'templateName'
  DESCRIPTION_FIELD_ID = 'templateDesc'

  def check_page_displayed
    expect(self).to have_css 'h1', text: TITLE, exact_text: true
  end

  def enter_new_template_name(new_template_name)
    fill_in TEMPLATE_NAME_FIELD_ID, with: new_template_name, visible: false
    TestStatus.set_test_status(:new_template_name, new_template_name)
  end

  def enter_new_description(new_template_description)
    fill_in DESCRIPTION_FIELD_ID, with: new_template_description, visible: false
    TestStatus.set_test_status(:template_description, new_template_description)
  end

  def has_template_name?(template_name)
    find(TEMPLATE_NAME_FIELD_ID).value == template_name
  end

  def has_template_description?(template_description)
    find(DESCRIPTION_FIELD_ID).value == template_description
  end

  def find_update_banner_body
    find('template-tasklist-banner-updated_body')
  end

  def update_template_button
    click_button UPDATE_BUTTON
  end
end
