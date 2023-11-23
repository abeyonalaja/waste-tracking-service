require 'report_builder'

json_reports = Dir.glob('reports/parallel/*.json')

puts json_reports

# Configure ReportBuilder
ReportBuilder.configure do |config|
  config.json_path = json_reports
  config.report_path = 'reports/parallel_report'
  config.report_types = [:html]
  config.report_tabs = %w[Overview Features Scenarios Errors]
  config.report_title = 'Cucumber Test Results'
  config.additional_info = { browser: 'Chrome', environment: ENV['ENVIRONMENT'] }
  config.compress_images = false
end

ReportBuilder.build_report

ReportBuilder.configure do |config|
  config.json_path = 'reports/retry_report.json'
  config.report_path = 'reports/retry_report'
  config.report_types = [:html]
  config.report_tabs = %w[Overview Features Scenarios Errors]
  config.report_title = 'Cucumber Retry test report Results'
  config.compress_images = false
end

ReportBuilder.build_report
