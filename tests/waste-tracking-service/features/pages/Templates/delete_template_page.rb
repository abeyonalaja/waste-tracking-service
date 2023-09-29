# frozen_string_literal: true

require_relative '../shared_components/general_helpers'
require_relative '../shared_components/error_box'
# this page is delete template  page details
class DeleteTemplatePage < GenericPage
  include GeneralHelpers
  include ErrorBox

  TITLE = Translations.value 'templates.manage.delete.title'
  CONFIRM_BUTTON = Translations.value 'confirmContinueButton'

  def check_page_displayed
    expect(self).to have_css 'h1', text: TITLE, exact_text: true
  end

  def find_delete_banner_body
    find('template-banner-delete_body')
  end

  def confirm_button
    click_button CONFIRM_BUTTON
  end
end
