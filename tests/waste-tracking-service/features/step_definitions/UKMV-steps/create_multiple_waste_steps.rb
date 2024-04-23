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

Given(/^I login into ukwm FE mock gateway app$/) do
  Log.info("Start url: #{Env.start_page_url}")
  TestStatus.set_test_status('Test ENV', Env.test_env)
  TestStatus.set_test_status('Start url', Env.start_page_url)
  visit(Env.start_page_url)
  HelperMethods.wait_for_a_sec
  user = "USER#{@current_process}"
  OverviewPage.new.login_to_dcid(user)
  set_feature_cookies
end
