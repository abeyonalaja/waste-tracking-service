Then(/^I should see service home page correctly translated$/) do
  ServiceHomePage.new.check_page_translation
end

And(/^I click Create a new multiple waste movement link$/) do
  click_link Translations.ukmv_value 'moveWastePage.cardLink'
  sleep(100)
end

And(/^I click HOME breadcrumb$/) do
  click_link Translations.ukmv_value 'moveWastePage.breadcrumbs.home'
end
