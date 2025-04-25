mkdir -p report
export START_PAGE_URL=
export CONFIG_NAME=parallel
export DRIVER=browserstack
cucumber --color --format pretty --format html --out ./report/cucumber-report.html --format json --out test-report.json --tags '@t'
