And(/^I verify whats producer address page is correctly translated$/) do
  WhatsProducerAddressPage.new.check_page_translation
end

And(/^I enter valid producer postcode$/) do
  pending
end

And(/^I click search postcode button$/) do
  pending
end

And(/^I verify select producer address page is correctly translated$/) do
  SelectProducerAddressPage.new.check_page_translation
end

And(/^I enter postcode with 0 addresses$/) do
  pending
end

And(/^I verify no address found page is correctly translated$/) do
  NoAddressFoundPage.new.check_page_translation
end

And(/^I verify manual entry page is translated correctly$/) do
  EnterProducerAddressManualPage.new.check_page_translation
end

Then(/^I complete the Enter Producer Address Manual page$/) do
  pending
end

And(/^I select first address$/) do
  pending
end
