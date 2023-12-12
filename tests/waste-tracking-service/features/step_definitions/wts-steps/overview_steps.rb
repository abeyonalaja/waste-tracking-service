Given(/^I login to waste tracking portal$/) do
  Log.info("Start url: #{Env.start_page_url}")
  TestStatus.set_test_status('Test ENV', Env.test_env)
  TestStatus.set_test_status('Start url', Env.start_page_url)
  visit(Env.start_page_url)
  click_link('dashboard_link')
  user = "USER#{@current_process}"
  OverviewPage.new.login_to_DCID(user)
  ExportWasteFromUkPage.new.check_page_displayed
  ViewCookiesPage.new.reject_analytics_cookies_button if @reset_cookies == true
end

And(/^I navigate to the overview page$/) do
  click_link('dashboard_link')
  user = "USER#{@current_process}"
  TestStatus.set_test_status(:current_user, user.to_sym)
  OverviewPage.new.sign_in_or_create_an_account
  HelperMethods.wait_for_a_sec
  case Env.test_env
  when 'LOCAL'
    OverviewPage.new.sign_in(TestData::Users.user_name(user.to_sym), TestData::Users.user_password(user.to_sym))
  when 'DEV', 'TST', 'PRE'
    OverviewPage.new.sign_in(TestData::Users.user_name(user.to_sym), TestData::Users.user_password(user.to_sym))
  else
    raise "#{Env.test_env} is an unknown environment, Please provide the correct env details"
  end
  HelperMethods.wait_for_a_sec
  ExportWasteFromUkPage.new.check_page_displayed
end

Then(/^I can see all the sections$/) do
  expect(page).to have_css 'h2', text: Translations.value('exportJourney.submitAnExport.title'), exact_text: true
  expect(page).to have_css 'h2', text: Translations.value('exportJourney.exportHome.card.update'), exact_text: true
  expect(page).to have_css 'h2', text: Translations.value('exportJourney.exportHome.card.submitted'), exact_text: true
  expect(page).to have_css 'h2', text: Translations.value('exportJourney.exportHome.card.templates'), exact_text: true
end

And(/^I can see links for each sections$/) do
  expect(page).to have_link Translations.value('exportJourney.submitAnExport.title')
  expect(page).to have_link Translations.value('exportJourney.incompleteAnnexSeven.title')
  expect(page).to have_link Translations.value 'exportJourney.exportSubmitted.updateAnnexRecordWithActuals'
  expect(page).to have_link Translations.value 'exportJourney.exportSubmitted.viewSubmittedRecords'
end

Then(/^Export waste from UK page is displayed$/) do
  ExportWasteFromUkPage.new.check_page_displayed
end
