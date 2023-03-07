# WTS Frontend Acceptance Tests

This repository contains all the Ruby automated acceptance tests

# Notes

* The gems used for the acceptance tests are contained within the `Gemfile`
* A number of generic UI steps have been included in `features/step-defintions/generic_ui_steps` to help get you started


The following files list the changes you will need to add to your project.

* `features/support/config.rb` to configure Capybara to use Selenium and Chrome
* `Gemfile` to add the Selenium Webdriver gem

The test run results will be shown in `report.json` as usual.
