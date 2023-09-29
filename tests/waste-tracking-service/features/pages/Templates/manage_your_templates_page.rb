# frozen_string_literal: true

require_relative '../shared_components/general_helpers'
require_relative '../shared_components/error_box'
# this page is manage templates page details
class ManageTemplatesPage < GenericPage
  include GeneralHelpers
  include ErrorBox

  TITLE = Translations.value 'templates.manage.title'
  INTRO = Translations.value 'templates.manage.intro'
  TEMPLATE = Translations.value 'templates.template'
  LAST_UPDATED = Translations.value 'templates.manage.table.col.lastUpdated'

  # ISSUE WITH ACTIONS TEXT  IN THE TRANSLATION FILE. NEED TO BE CHECKED
  # ACTIONS = Translations.value 'actions'

  NEW_TEMPLATE = Translations.value 'templates.manage.newTitle'
  CREATE_NEW_TEMPLATE_LINK = Translations.value 'templates.createLink'
  CREATE_TEMPLATE_CAPTION = Translations.value 'templates.manage.newTitle'
  USE_TEMPLATE_LINK = Translations.value 'templates.manage.table.link.use'
  DELETE_TEMPLATE_LINK = Translations.value 'templates.manage.table.link.delete'
  MAKE_COPY_LINK = Translations.value 'templates.manage.table.link.copy'
  NO_TEMPLATES_CAPTION = Translations.value 'templates.manage.noResults'

  def check_page_displayed
    expect(self).to have_css 'h1', text: TITLE, exact_text: true
  end

  def check_empty_page_displayed
    expect(self).to have_css 'h1', text: NO_TEMPLATES_CAPTION, exact_text: true
  end

  def check_page_translation
    expect(self).to have_text TITLE
    expect(self).to have_text INTRO
    expect(self).to have_text TEMPLATE
    expect(self).to have_text LAST_UPDATED
    # expect(self).to have_text ACTIONS
    expect(self).to have_text NEW_TEMPLATE
    expect(self).to have_text CREATE_NEW_TEMPLATE_LINK
    expect(self).to have_text CREATE_TEMPLATE_CAPTION
    expect(self).to have_text USE_TEMPLATE_LINK
    expect(self).to have_text DELETE_TEMPLATE_LINK
    expect(self).to have_text MAKE_COPY_LINK
  end

  def first_template_name
    find('template-link-tasklist-0')
  end

  def make_copy_link
    click_link 'template-link-copy-0'
  end

  def delete_link
    click_link 'template-link-delete-0'
  end
end
