# frozen_string_literal: true

# this page is for feedback survey page details
class FeedbackSurveyPage < GenericPage

  TITLE = Translations.value 'feedback.title'
  SUB_TITLE = Translations.value 'feedbackForm.title'
  OVERALL = Translations.value 'feedbackForm.rating.title'
  VERY_SATISFIED_OPTION = Translations.value 'feedbackForm.rating-5'
  SATISFIED_OPTION = Translations.value 'feedbackForm.rating-4'
  NEITHER_OPTION = Translations.value 'feedbackForm.rating-3'
  DISSATISFIED_OPTION = Translations.value 'feedbackForm.rating-2'
  VERY_DISSATISFIED_OPTION = Translations.value 'feedbackForm.rating-1'
  IMPROVEMENT_LABEL = Translations.value 'feedbackForm.improvement.label'
  IMPROVEMENT_HINT = Translations.value 'feedbackForm.improvement.hint'
  SEND_BUTTON = Translations.value 'feedbackForm.submitButton'

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

  def find_banner_title
    find('govuk-notification-banner-title')
  end
end
