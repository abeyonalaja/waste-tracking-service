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
  click_link link
  camel_case_page_name = page_name.split.map(&:capitalize).push('Page').join
  page_class = Object.const_get camel_case_page_name
  page_object = page_class.new
  page_object.check_page_displayed
end

And(/^I click the Save and return to draft$/) do
  click_on GetTag.get_value 'saveReturnLink'
end

And(/^I click the button Save and continue$/) do
  click_on GetTag.get_value 'saveButton'
end

When(/^I click the "([^"]*)" link$/) do |option|
  get_key = GetTag.get_key(option)
  click_link GetTag.get_value(get_key)
end

Then(/^the "([^"]*)" page is displayed$/) do |page_name|
  camel_case_page_name = page_name.split.map(&:capitalize).push('Page').join
  page_class = Object.const_get camel_case_page_name
  page_object = page_class.new
  page_object.check_page_displayed
end
