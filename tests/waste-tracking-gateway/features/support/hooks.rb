Before do
  @region = (ENV['START_PAGE_URL']) || 'Local'
  Log.info("Running the tests in region  #{@region}")
end

$before_all_has_run = false

Before do |scenario|

  unless $before_all_has_run
    # remove the token file before running the scenario
    file_path = 'token.txt'
    if File.exist?(file_path)
      File.delete(file_path)
      Log.info("File '#{file_path}' has been deleted.")
    else
      Log.info("File '#{file_path}' does not exist.")
    end

    # run the command to get the token
    command = 'jmeter -n -t get_token_new.jmx'
    result = `#{command}`
    Log.info("Command output:\n#{result}\n")
    sleep 2
    file_path = 'token.txt'

    if File.exist?(file_path)
      $token = File.read(file_path)
      Log.info('Token file exists')
    else
      Log.info('Token file does not exist.')
    end
    $before_all_has_run = true
  end

end
