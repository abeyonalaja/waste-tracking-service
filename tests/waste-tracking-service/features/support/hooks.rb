Before do |scenario|
  TestStatus.reset_test_status
  @feature_name = File.basename(scenario.location.file, '.feature').to_s
  Log.info("Started: #{scenario.name} - #{@feature_name} feature")
end

Before('not @cookies') do
  @reset_cookies = true
end

After do |scenario|
  if scenario.failed?
    Log.console("Failed scenario is #{scenario.name}")
    Log.warn("Test status report: #{JSON.pretty_generate(TestStatus.test_status)}")
    png_files = Dir.glob(File.join('report', 'screenshot_*.png'))
    attach "#{png_files}", 'image/png'
  end
end
