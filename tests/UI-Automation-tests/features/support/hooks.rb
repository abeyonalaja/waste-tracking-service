Before do |scenario|
  @feature_name = File.basename(scenario.location.file, '.feature').to_s
  Log.info("Started: #{scenario.name} - #{@feature_name} feature")
end

After do |scenario|
  Log.info("Completed: #{scenario.name} - #{@feature_name} feature")
  case scenario.status
  when :failed
    Log.console("Failed scenario is #{scenario.name}")
    Log.warn("Test status report: #{JSON.pretty_generate(TestStatus.test_status)}")
  end

end

