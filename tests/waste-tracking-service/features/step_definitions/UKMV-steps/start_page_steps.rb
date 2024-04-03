Given(/^I navigate to start page$/) do
  Log.info("Start url: #{Env.start_page_url}")
  TestStatus.set_test_status('Start url', Env.start_page_url)
  visit(Env.start_page_url)
end

Then(/^I should see start page is correctly translated$/) do
  StartPage.new.check_page_translation
end
