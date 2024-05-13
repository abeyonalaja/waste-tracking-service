# frozen_string_literal: true

# this page is for multiple confirmation upload page details
class MultipleConfirmationUploadPage < GenericPage
  include GeneralHelpers
  include ErrorBox

  TITLE = Translations.value 'multiples.exportSubmitted.panelTitle'
  DETAILS_LINK = Translations.value 'multiples.confirmation.detailsLink'
  STATEMENT = Translations.value 'exportJourney.exportSubmitted.statement'
  STEPS_PROMPT = Translations.value 'multiples.confirmation.stepsPrompt'
  STEP_ONE = Translations.value 'multiples.confirmation.stepOne'
  STEP_TWO = Translations.value 'multiples.confirmation.stepTwo'
  STEP_THREE = Translations.value 'multiples.confirmation.stepThree'
  UPDATE_ACTUALS = Translations.value 'mulitples.confirmation.updateTitle'
  ESTIMATE_PROMPT = Translations.value 'multiples.confirmation.estimatesPrompt'
  ESTIMATE_ONE = Translations.value 'multiples.confirmation.estimatesOne'
  ESTIMATE_TWO = Translations.value 'multiples.confirmation.estimatesTwo'
  LEGAL_ONE = Translations.value 'multiples.confirmation.legalStatementp1'
  LEGAL_TWO = Translations.value 'multiples.confirmation.legalStatementp2'
  RETURN_BUTTON = Translations.value 'multiples.confirmation.returnButton'

  def check_page_displayed(rows)
    title = TITLE.gsub('{{count}}', rows.to_s)
    expect(self).to have_css 'h1', text: title, exact_text: true, wait: 10
  end

  def check_page_translation
    expect(self).to have_link DETAILS_LINK
    expect(self).to have_text STATEMENT
    expect(self).to have_text STEPS_PROMPT
    expect(self).to have_text STEP_ONE
    expect(self).to have_text STEP_TWO
    expect(self).to have_text STEP_THREE
    expect(self).to have_text UPDATE_ACTUALS
    expect(self).to have_text ESTIMATE_PROMPT
    expect(self).to have_text ESTIMATE_ONE
    expect(self).to have_text ESTIMATE_TWO
    expect(self).to have_text LEGAL_ONE
    expect(self).to have_text LEGAL_TWO
    expect(self).to have_link RETURN_BUTTON
  end

  def upload_successful
    max_wait_time = 30
    begin
      Timeout.timeout(max_wait_time) do
        sleep 0.1 until page.has_css?('h2', text: STATEMENT, exact_text: true)
      end
    rescue Timeout::Error
      puts 'Submission did not complete successfully within the specified time.'
    end
  end
end
