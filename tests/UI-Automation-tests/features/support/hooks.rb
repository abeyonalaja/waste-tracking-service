Before do |scenario|
  @feature_name = File.basename(scenario.location.file, '.feature').to_s
  Log.info("Started: #{scenario.name} - #{@feature_name} feature")
end

After do |scenario|
  Log.info("Completed: #{scenario.name} - #{@feature_name} feature")
end

