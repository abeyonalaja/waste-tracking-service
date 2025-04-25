# frozen_string_literal: true

# this page is for ukmw feedback survey page details
class UkwmFeedbackSurveyPage < GenericPage

  TITLE = Translations.ukmv_value 'feedbackPage.form.headingOne'
  SUB_TITLE = Translations.ukmv_value 'feedbackPage.form.headingTwo'
  OVERALL = Translations.ukmv_value 'feedbackPage.form.rating.heading'
  VERY_SATISFIED_OPTION = Translations.ukmv_value 'feedbackPage.form.rating.labelOne'
  SATISFIED_OPTION = Translations.ukmv_value 'feedbackPage.form.rating.labelTwo'
  NEITHER_OPTION = Translations.ukmv_value 'feedbackPage.form.rating.labelThree'
  DISSATISFIED_OPTION = Translations.ukmv_value 'feedbackPage.form.rating.labelFour'
  VERY_DISSATISFIED_OPTION = Translations.ukmv_value 'feedbackPage.form.rating.labelFive'
  IMPROVEMENT_LABEL = Translations.ukmv_value 'feedbackPage.form.textArea.heading'
  IMPROVEMENT_HINT = Translations.ukmv_value 'feedbackPage.form.textArea.hint'
  SEND_BUTTON = Translations.ukmv_value 'feedbackPage.form.submitButton'

  DESCRIPTION_FIELD_ID = 'feedbackTextAreaField'
  def check_page_displayed
    expect(self).to have_css 'h1', text: TITLE, exact_text: true
  end

  def check_page_translation
    expect(self).to have_text SUB_TITLE
    expect(self).to have_text OVERALL
    expect(self).to have_text VERY_SATISFIED_OPTION
    expect(self).to have_text SATISFIED_OPTION
    expect(self).to have_text NEITHER_OPTION
    expect(self).to have_text DISSATISFIED_OPTION
    expect(self).to have_text VERY_DISSATISFIED_OPTION
    expect(self).to have_text IMPROVEMENT_LABEL
    expect(self).to have_text IMPROVEMENT_HINT
  end

  def enter_description(description)
    fill_in DESCRIPTION_FIELD_ID, with: description, visible: false
  end

  def find_banner_title
    find('govuk-notification-banner-title')
  end

  def find_banner_body
    find('govuk-notification-banner-content-heading')
  end
end
