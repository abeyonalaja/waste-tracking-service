# frozen_string_literal: true

# this page is for shutter page details
class ShutterPage < GenericPage

  TITLE_500 = Translations.value '500.title'
  PARAGRAPH1_500 = Translations.value '500.paragraph1'
  PARAGRAPH2_500 = Translations.value '500.paragraph2'

  def check_page_displayed_500
    expect(self).to have_css 'h1', text: TITLE_500, exact_text: true
  end

  def check_translation_500
    expect(page).to have_text PARAGRAPH1_500
    expect(page).to have_text PARAGRAPH2_500
  end

  TITLE_404 = Translations.value '404.title'
  PARAGRAPH1_404 = Translations.value '404.paragraph1'
  PARAGRAPH2_404 = Translations.value '404.paragraph2'
  ACCOUNT_LINK_404 = Translations.value '404.link'
  def check_page_displayed_404
    expect(self).to have_css 'h1', text: TITLE_404, exact_text: true
  end

  def check_translation_404
    expect(page).to have_text PARAGRAPH1_404
    expect(page).to have_text PARAGRAPH2_404
    expect(page).to have_link ACCOUNT_LINK_404
  end

end
