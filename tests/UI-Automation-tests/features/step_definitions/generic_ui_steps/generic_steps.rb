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

And(/^clicking "([^"]*)" link should display "([^"]*)" page$/) do |back, page_name|
  click_link 'Back'
  camel_case_page_name = page_name.split.map(&:capitalize).push('Page').join
  page_class = Object.const_get camel_case_page_name
  page_object = page_class.new
  page_object.check_page_displayed
end

And(/^I click the Save and return to draft$/) do
  AddReferenceNumberPage.new.save_and_return_to_draft
end

And(/^I click the button Save and continue$/) do
  AddReferenceNumberPage.new.save_and_continue
end
