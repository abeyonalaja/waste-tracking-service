And(/^I verify ukwm feedback page is translated correctly$/) do
  UkwmFeedbackSurveyPage.new.check_page_translation
end

And(/^I click send feedback button$/) do
  click_button Translations.ukmv_value 'feedbackPage.form.submitButton'
end

Then(/^I see success banner displayed$/) do
  expect(UkwmFeedbackSurveyPage.new.find_banner_title.text).to eq 'Success'
  expect(UkwmFeedbackSurveyPage.new.find_banner_body.text).to eq 'You have submitted your feedback'
end

And(/^I click the Go back to the page you were looking at link$/) do
  click_link(href: '/move-waste/en')
end

And(/^I enter feedback description$/) do
  UkwmFeedbackSurveyPage.new.enter_description 'user testing feedback'
end
