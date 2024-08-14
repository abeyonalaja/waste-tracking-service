And(/^I verify source of the waste page is correctly translated$/) do
  SourceOfTheWastePage.new.check_page_translation
end

Then(/^I verify previously selected source option is pre\-selected$/) do
  expect(SourceOfTheWastePage.new.option_checked?('Industrial waste')).to eq(true)
end
