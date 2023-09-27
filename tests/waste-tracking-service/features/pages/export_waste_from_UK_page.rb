# frozen_string_literal: true

# this page is for export waste from uk page details
class ExportWasteFromUkPage < GenericPage

  TITLE = Translations.value 'app.title'
  def check_page_displayed
    expect(self).to have_css 'h1', text: TITLE, exact_text: true
  end

  def create_single_annex_record
    click_link('Create a single Annex VII record')
  end

end
