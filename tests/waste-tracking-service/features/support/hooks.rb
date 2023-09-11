require 'allure-cucumber'

$report_path = 'allure_screenshots'

Before do |scenario|
  TestStatus.reset_test_status
  @feature_name = File.basename(scenario.location.file, '.feature').to_s
  Log.info("Started: #{scenario.name} - #{@feature_name} feature")
end

AfterStep do |scenario|
  if scenario.failed?
    file_path = "screenshots/#{Time.now.strftime('%Y-%m-%d_%H-%M-%S')}.png"
    page.save_screenshot(file_path)

    Allure.add_attachment(
      name: 'Screenshot',
      source: File.open(file_path, 'rb') { |file| file.read },
      type: Allure::ContentType::PNG
    )
  end
end

After do |scenario|
  if scenario.failed?
    # file_path = "screen/#{Time.now.strftime('%Y-%m-%d_%H-%M-%S')}.png"
    # puts file_path
    # puts '****'
    Log.console("Failed scenario is #{scenario.name}")
    Log.warn("Test status report: #{JSON.pretty_generate(TestStatus.test_status)}")

    file = Tempfile.new(%w[screenshot_ .png], 'report')
    screenshot_path = File.join('report', "#{Time.now.strftime('%Y-%m-%d_%H-%M-%S')}.png")
    puts screenshot_path
    png_files = Dir.glob(File.join('report', 'screenshot_*.png'))
    puts png_files
    puts '&&&&&&&&&'
    attach "#{png_files}", 'image/png'
    # page.save_screenshot(file_path)

    Allure.add_attachment(
      name: 'Attachment',
      source: "#{png_files}",
      type: Allure::ContentType::PNG,
      test_case: true
    )
  end
end

# Log.console("Failed scenario is #{scenario.name}")
# Log.warn("Test status report: #{JSON.pretty_generate(TestStatus.test_status)}")
# file = Tempfile.new(%w[screenshot_ .png], ENV['ALLURE_SCREENSHOTS_DIR'])
# screenshot = file.path
# file.close(true)
# puts screenshot
# puts '********'
# page.save_screenshot(screenshot)
# attach "#{screenshot}", 'image/png'
# # screenshot_path = File.join('report', "#{Time.now.strftime('%Y-%m-%d_%H-%M-%S')}.png")
# # puts screenshot_path
# #
# # screenshot_path = File.join(ENV['ALLURE_SCREENSHOTS_DIR'], "#{Time.now.strftime('%Y-%m-%d_%H-%M-%S')}.png")
# # page.save_screenshot(screenshot_path)
# #
# # puts '******'
# # screenshot = file.path
# # puts screenshot
# # puts '****'
# # screenshot = page.driver.browser.screenshot_as(:base64)
#
# # Attach the screenshot to Allure report using Allure.add_attachment
# Allure.add_attachment(
#   name: 'Failure Screenshot',
#   source: File.open("#{screenshot}"),
#   type: Allure::ContentType::PNG,
#   test_case: true
# )
# end

# After do |scenario|
#   Log.info("Completed: #{scenario.name} - #{@feature_name} feature")
#   case scenario.status
#   when :failed
#     Log.console("Failed scenario is #{scenario.name}")
#     Log.warn("Test status report: #{JSON.pretty_generate(TestStatus.test_status)}")
#     file = Tempfile.new(%w[screenshot_ .png], 'report')
#     screenshot_path = File.join('report', "#{Time.now.strftime('%Y-%m-%d_%H-%M-%S')}.png")
#     puts screenshot_path
#
#     screenshot_path = File.join(ENV['ALLURE_SCREENSHOTS_DIR'], "#{Time.now.strftime('%Y-%m-%d_%H-%M-%S')}.png")
#     page.save_screenshot(screenshot_path)
#
#     puts '******'
#     screenshot = file.path
#     puts screenshot
#     puts '****'
#     # screenshot = page.driver.browser.screenshot_as(:base64)
#
#     # Attach the screenshot to Allure report using Allure.add_attachment
#     Allure.add_attachment(
#       name: 'Failure Screenshot',
#       source: screenshot_path,
#       type: Allure::ContentType::PNG
#     )
#   # end
#     # Allure.add_attachment(name: 'Attachment', source: File.open(screenshot.to_s), type: Allure::ContentType::PNG,
#     #                       test_case: true)
#     # screenshot_path = File.join(ENV['ALLURE_SCREENSHOTS_DIR'], "#{Time.now.strftime('%Y-%m-%d_%H-%M-%S')}.png")
#     # page.save_screenshot(screenshot_path)
#     # embed(screenshot_path, 'image/png', 'Screenshot')
#   end
#
# end

