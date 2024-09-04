And(/^I verify sic code page is translated correctly$/) do
  SicCodePage.new.check_page_translation
end

And(/^I select a SIC code$/) do
  SicCodePage.new.select_sic_code
end
