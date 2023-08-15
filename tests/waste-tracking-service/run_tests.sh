#cucumber  --format pretty --expand --format json -o "report.json" --out report.html --tags 'not @ignore' --tags @t
mkdir -p report
export START_PAGE_URL=http://52.151.120.75/
export DRIVER=remote_driver
cucumber --color --format pretty --format html --out ./report/cucumber-report.html --format json --out test-report.json --tags 'not @ignore'
