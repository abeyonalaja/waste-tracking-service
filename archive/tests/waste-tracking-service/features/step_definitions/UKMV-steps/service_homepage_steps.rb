Then(/^I should see UKWM home page correctly translated$/) do
  UkwmHomePage.new.check_page_translation
end

And(/^I click Create a new multiple waste movement link$/) do
  click_link Translations.ukmv_value 'moveWastePage.newWasteMovements.multipleMovementLink'
end

And(/^I click HOME breadcrumb$/) do
  click_link Translations.ukmv_value 'moveWastePage.breadcrumbs.home'
end
