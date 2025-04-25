# frozen_string_literal: true

# this page is for remove sic codee page details
class RemoveSicCodePage < GenericPage
  include CommonComponents
  include PageHelper
  include ErrorBox
  include GeneralHelpers

  TITLE = Translations.ukmv_value 'single.producer.sicCodes.remove.title'


  def check_page_displayed
    expect(self).to have_css 'h1', text: TITLE, exact_text: true
  end

end
