And(/^I verify ukw add reference page is correctly translated$/) do
  UkwmAddReferencePage.new.check_page_translation
end

And(/^I enter valid ukw reference$/) do
  UkwmAddReferencePage.new.enter_reference 'ABC_ 01/02/2025'
end

And(/^I enter ukw reference with more than 20 chars$/) do
  UkwmAddReferencePage.new.enter_reference 'ABC_ 01/02/202501/02/202501/02/2025'
end

And(/^I enter ukw reference with special chars$/) do
  UkwmAddReferencePage.new.enter_reference 'ABC_ 01/02/2025!@#'
end
