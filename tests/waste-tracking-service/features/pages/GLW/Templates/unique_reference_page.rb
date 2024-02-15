# frozen_string_literal: true

# this page is unique reference page details
class UniqueReferencePage < GenericPage
  include GeneralHelpers
  include ErrorBox

  TITLE = Translations.value 'templates.use.title'
  INTRO = Translations.value 'templates.use.intro'

  def check_page_displayed
    expect(self).to have_css 'h1', text: TITLE, exact_text: true
  end

  def check_page_translation
    expect(self).to have_text TITLE
    expect(self).to have_text INTRO
  end
end
