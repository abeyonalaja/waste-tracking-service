# frozen_string_literal: true

# Module is for glw upload success page
class GlwUploadSuccessPage < GenericPage
  include GeneralHelpers
  include ErrorBox

  HINT_TEXT = Translations.value 'multiples.success.intro'
  TITLE = Translations.value 'multiples.success.heading_other'

  def check_page_displayed count
    expect(self).to have_css 'h1', text: TITLE.gsub!('{{count}}', count), exact_text: true, wait: 10
  end

  def check_page_translation
    expect(self).to have_text HINT_TEXT
  end

  def check_csv_with_no_error_displayed
    expect(self).to have_text 'You have corrected all your errors and can submit 1 Annex VII record.'
  end

  def wait_to_upload
    max_wait_time = 30
    begin
      Timeout.timeout(max_wait_time) do
        sleep 0.1 until page.has_css?('.govuk-notification-banner-title', text: 'Success')
      end
    rescue Timeout::Error
      puts 'Upload did not complete successfully within the specified time.'
    end
  end

end
