Before do
  @region = (ENV['START_PAGE_URL']) || 'Local'
  Log.info("Running the tests in region  #{@region}")
end

Before do |scenario|
  Log.console("***********************New Scenario is #{scenario.name}*************************")
  TestStatus.reset_test_status
  @current_process = if ENV[:TEST_ENV_NUMBER.to_s].nil? || ENV[:TEST_ENV_NUMBER.to_s].empty?
                       '1'
                     else
                       ENV[:TEST_ENV_NUMBER.to_s]
                     end
  ENV[:TEST_ENV_NUMBER.to_s] = '1' if ENV[:TEST_ENV_NUMBER.to_s].nil? || ENV[:TEST_ENV_NUMBER.to_s].empty?
  @feature_name = File.basename(scenario.location.file, '.feature').to_s
  Log.info("Started: #{scenario.name} - #{@feature_name} feature")
  Log.console("STARTING FEATURE: #{@feature_name} for current process #{@current_process}")
  TestStatus.reset_test_status
  TestStatus.set_feature_flag('GLWMultipleGuidanceViewed', 'True')
end

$before_all_has_run = false

Before do |scenario|

  unless $before_all_has_run
    # remove the token file before running the scenario

    # Log.info("Start url: #{Env.app_page_url}")
    # TestStatus.set_test_status('Test ENV', Env.test_env)
    # TestStatus.set_test_status('Start url', Env.app_page_url)
    # visit(Env.app_page_url)
    # click_link('Start now')
    # sleep 1
    # user = "USER#{@current_process}"
    # OverviewPage.new.login_to_dcid(user)
    # sleep 2
    # visit("#{Env.app_page_url}/export-annex-VII-waste/api/auth/session")
    # sleep 5
    # page_source = page.body
    # puts page.body
    # token = page_source.match(/"token":"([^"]+)"/)[1]

    # puts token

    $token = 'eyJhbGciOiJSUzI1NiIsImtpZCI6Im05cTZ4Q1YzZEVCay0zOWItbUhraWtUZjNNb1dnT1UyLVN0SC03R3BGRTAiLCJ0eXAiOiJKV1QifQ.eyJ2ZXIiOiIxLjAiLCJpc3MiOiJodHRwczovL2RjaWRtdGVzdC5iMmNsb2dpbi5jb20vMTMxYTM1ZmItMDQyMi00OWM5LTg3NTMtMTUyMTdjZWM1NDExL3YyLjAvIiwic3ViIjoiMTRlMjNkZjYtZTU3Mi00OTlmLWI0ZDctOWJhZDEwZjZhMDBhIiwiYXVkIjoiNjNiN2IwZTUtNTc3MC00YTI4LTkzYjMtN2ZkMjQyNTI5NWYwIiwiZXhwIjoxNzE2MzA0MTI1LCJhY3IiOiJiMmNfMWFfY3VpX2NwZGV2X3NpZ251cHNpZ25pbiIsImlhdCI6MTcxNjMwMjkyNSwiYXV0aF90aW1lIjoxNzE2MzAyOTI0LCJhYWwiOiIxIiwic2VydmljZUlkIjoiMjk0YWU4M2MtYjdjYS1lYzExLWE3YjUtMDAwZDNhYjY3OGM5IiwiY29ycmVsYXRpb25JZCI6IjcwMGYzOWE3LTM3ZmQtNDYwNC05YjY5LTY2ZmEyN2Y5MDkyOSIsImN1cnJlbnRSZWxhdGlvbnNoaXBJZCI6ImM5YTE2YWIwLWNhZjctZWUxMS1hMWZlLTAwMGQzYWJiZDI2NiIsInNlc3Npb25JZCI6IjYzN2ExYWQ5LTJkNDQtNDZlZi04MDA5LWFlNGRhMmNkNTY0NiIsImVtYWlsIjoiMmprcG00cG16c0BtYWlsY3VyaXR5LmNvbSIsImNvbnRhY3RJZCI6Ijc5ZjgxMmFhLWNhZjctZWUxMS1hMWZlLTAwMGQzYWJiZDI2NiIsImZpcnN0TmFtZSI6IkVtaWwiLCJsYXN0TmFtZSI6IlNoZXN0YWtvdiIsInVuaXF1ZVJlZmVyZW5jZSI6IkJBMjAyNDUyLUI3LTEzMDQtTTYtMTEwNiIsImxvYSI6MCwiZW5yb2xtZW50Q291bnQiOjEsImVucm9sbWVudFJlcXVlc3RDb3VudCI6MCwicmVsYXRpb25zaGlwcyI6WyJjOWExNmFiMC1jYWY3LWVlMTEtYTFmZS0wMDBkM2FiYmQyNjY6OjowOkNpdGl6ZW46MCJdLCJyb2xlcyI6WyJjOWExNmFiMC1jYWY3LWVlMTEtYTFmZS0wMDBkM2FiYmQyNjY6VUsgV2FzdGUgT3BlcmF0b3IgQWRtaW46MyJdLCJuYmYiOjE3MTYzMDI5MjV9.NfSGncEo7SOWPWAggxloB5FRUso_dmxMuzEHElbFhYWc021B3Jv-evae4LUzlUa9G74ELAC50Y8aysO8lsERGpQBfy5rLwbMYJnMtjOfdZaLJGQvo6AXQ5GtdMPvUuPs-iefZFhM7NBZuHDGHp-t3hSUwgYcpFULbjgshgUJgE7PYKAF77QMwsgFQxm8L-1k0QtDRJAK3ujBevj-JzYhw5i62YLtr3DtIlbWT_fDEJJnX5_3ccpcgTFdteAmtGJiH04BGKiv3eZ2-xBEsIWznJfQ_K8KBmHKJPuPoPtJQYh9RrZgj0szcG5d3he4OdtwxWN7hvN0VJlrKPwSpFcngg'
    $before_all_has_run = true
  end
end
