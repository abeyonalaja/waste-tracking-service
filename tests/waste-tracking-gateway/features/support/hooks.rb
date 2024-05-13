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

    Log.info("Start url: #{Env.app_page_url}")
    TestStatus.set_test_status('Test ENV', Env.test_env)
    TestStatus.set_test_status('Start url', Env.app_page_url)
    visit(Env.app_page_url)
    click_link('Start now')
    sleep 1
    user = "USER#{@current_process}"
    OverviewPage.new.login_to_dcid(user)
    sleep 2
    visit("#{Env.app_page_url}/export-annex-VII-waste/api/auth/session")
    sleep 5
    page_source = page.body
    puts page.body
    token = page_source.match(/"token":"([^"]+)"/)[1]

    puts 'TOKEN is ---'
    puts token

    $token = token

    puts '&&&&&&&&&&&&&'
    # https://track-waste-tst.azure.defra.cloud/en/export-annex-VII-waste/api/auth/session
    # # https://track-waste-tst.azure.defra.cloud/api/auth/session
    # path = '/api/auth/session'
    # uri = URI.parse Env.app_page_url.to_s
    # http = Net::HTTP.new(uri.host, uri.port)
    # http.use_ssl = true if uri.instance_of? URI::HTTPS
    # http.set_debug_output($stdout)
    # headers = { 'Content-Type': 'application/json' }
    #
    # request = Net::HTTP::Get.new(path, headers)
    #
    # @response = http.request(request)
    #
    # puts @response.code
    # puts '^^^^^^^^^TOKEN^^^^^^^^^^^^^'
    # puts @response.body
    # @body = JSON.parse(@response.body)
    # puts @body
    # puts '&&&&&&&&&&&'
    $before_all_has_run = true
  end

end
