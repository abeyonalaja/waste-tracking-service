Then(/^I remain on the (.+) page with an "([^"]*)" error message displayed$/) do |page_name, error_message|
  camel_case_page_name = page_name.split.map(&:capitalize).push('Page').join
  page_class = Object.const_get camel_case_page_name
  page_object = page_class.new
  page_object.check_page_displayed
  expect(page_object).to have_error_message error_message
end

And(/^I click browser back button$/) do
  page.go_back
end

And(/^I click "([^"]*)" link should display "([^"]*)" page$/) do |link, page_name|
  click_link Translations.value link.downcase
  camel_case_page_name = page_name.split.map(&:capitalize).push('Page').join
  page_class = Object.const_get camel_case_page_name
  page_object = page_class.new
  page_object.check_page_displayed
end

And(/^I click the button Save and continue$/) do
  click_button Translations.value 'saveButton'
end

When(/^I click the Save and return to draft$/) do
  click_link Translations.value 'saveReturnButton'
end

When(/^I click the "([^"]*)" link$/) do |option|
  get_key = Translations.key(option)
  click_link Translations.value(get_key)
end

Then(/^?(?:I|the)? ?(?:should see)? "([^"]*)" page is displayed$/) do |page_name|
  camel_case_page_name = page_name.split.map(&:capitalize).push('Page').join
  page_class = Object.const_get camel_case_page_name
  page_object = page_class.new
  page_object.check_page_displayed
end

When(/^I choose "([^"]*)" radio button$/) do |option|
  choose(option, visible: false)
end

And(/^I click Continue button$/) do
  click_on Translations.value 'continueButton'
end

And(/^I click Return to draft button$/) do
  click_on Translations.value 'returnToDraft'
end

And(/^I click the last "([^"]*)" link$/) do |option|
  get_key = Translations.key(option)
  all(text: Translations.value(get_key)).last.click
end
