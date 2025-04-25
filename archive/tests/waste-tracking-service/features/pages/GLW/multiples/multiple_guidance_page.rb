# frozen_string_literal: true

# this page is for guidance pagedetails
class MultipleGuidancePage < GenericPage
  include GeneralHelpers
  include ErrorBox

  TITLE = Translations.value 'multiples.guidance.page.title'

  def check_page_displayed
    expect(self).to have_css 'h1', text: TITLE, exact_text: true
  end

end
