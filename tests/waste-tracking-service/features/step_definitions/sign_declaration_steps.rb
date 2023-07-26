And(/^I can see page translated correctly for bulk waste$/) do
  SignDeclarationPage.new.check_page_translation_bulk
end

And(/^I click confirm and submit button$/) do
  SignDeclarationPage.new.confirm_submit_button
end

Then(/^Export submitted page displayed$/) do
  expect(page).to have_text('Export submitted - plus code thing')
end

And(/^I can see page translated correctly for small waste$/) do
  SignDeclarationPage.new.check_page_translation_small
end
