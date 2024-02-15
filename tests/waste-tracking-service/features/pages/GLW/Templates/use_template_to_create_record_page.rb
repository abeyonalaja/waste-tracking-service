# frozen_string_literal: true

# this page is Use Template To Create Record page details
class UseTemplateToCreateRecordPage < GenericPage
  include GeneralHelpers
  include ErrorBox

  TITLE = Translations.value 'templates.useTemplates.title'
  INTRO = Translations.value 'templates.useTemplates.intro'
  TEMPLATE = Translations.value 'templates.template'
  LAST_UPDATED = Translations.value 'templates.manage.table.col.lastUpdated'

  NEW_TEMPLATE = Translations.value 'templates.manage.newTitle'
  CREATE_NEW_TEMPLATE_LINK = Translations.value 'templates.createLink'


  def check_page_displayed
    expect(self).to have_css 'h1', text: TITLE, exact_text: true
  end

  def check_page_translation
    expect(self).to have_text INTRO
    expect(self).to have_text TEMPLATE
    expect(self).to have_text LAST_UPDATED
    expect(self).to have_text NEW_TEMPLATE
    expect(self).to have_text CREATE_NEW_TEMPLATE_LINK
  end

end
