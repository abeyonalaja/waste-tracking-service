# frozen_string_literal: true

# this page is for start page details
class ServiceHomePage < GenericPage

  TITLE = Translations.ukmv_value 'moveWastePage.breadcrumbs.current'
  SUB_TITLE = Translations.ukmv_value 'moveWastePage.cardTitle'
  PARAGRAPH = Translations.ukmv_value 'moveWastePage.cardParagraphOne'
  PARAGRAPH2 = Translations.ukmv_value 'moveWastePage.cardTitleTwo'
  LINK = Translations.ukmv_value 'moveWastePage.cardLink'

  def check_page_displayed
    expect(self).to have_css 'h1', text: TITLE, exact_text: true
  end

  def check_page_translation
    expect(self).to have_text PARAGRAPH
    expect(self).to have_text PARAGRAPH2
    expect(self).to have_text LINK
    expect(self).to have_text SUB_TITLE
  end

end
