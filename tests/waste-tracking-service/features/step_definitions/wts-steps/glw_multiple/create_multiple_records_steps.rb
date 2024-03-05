And(/^I verify create multiple records page is correctly translated$/) do
  CreateMultipleRecordsPage.new.check_page_translation
end

Then(/^I should see multi Annex guidance page is display$/) do
  MultipleGuidancePage.new.check_page_displayed
end

Then(/^I should see glw csv helper page is displayed$/) do
  MultipleGuidanceBouncePage.new.check_page_displayed
end

And(/^I should see glw csv helper page translated$/) do
  MultipleGuidanceBouncePage.new.check_page_translation
end
