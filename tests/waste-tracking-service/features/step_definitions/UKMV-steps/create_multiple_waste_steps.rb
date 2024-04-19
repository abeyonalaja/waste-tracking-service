And(/^I verify create multiple waste page is correctly translated$/) do
  UkwmCreateMultipleWastePage.new.check_page_translation
end

And(/^I click on guidance link$/) do
  click_link(href: '/move-waste/en/multiples/guidance', :match => :first)
  switch_to_window(windows.last)
end

And(/^I verify interruption page is correctly translated$/) do
  UkwmInterruptionPage.new.check_page_translation
end

And(/^I verify guidance page is translated correctly$/) do
  UkwmUserGuidancePage.new.check_page_translation
end
