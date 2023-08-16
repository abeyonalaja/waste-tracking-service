# frozen_string_literal: true

class ViewSubmittedExportPage < GenericPage
  include GeneralHelpers
  include ErrorBox
  include CommonComponents

  TITLE = 'Annex VII record'

  def check_page_displayed
    expect(self).to have_css 'h1', text: TITLE, exact_text: true
  end

  def check_page_translation
    expect(self).to have_text 'You can download the Annex VII document or create a template based on a this submission.'
  end

  def transaction_number
    find('template-heading')
  end
end
