rm -r reports/*
mkdir -p reports
mkdir -p reports/parallel
export ENVIRONMENT='preprod'
export START_PAGE_URL=https://track-waste-pre.azure.defra.cloud/
rm -f failed_scenarios.txt

if [ -z "$1" ]; then
  bundle exec parallel_cucumber --type cucumber -n 4 features/ -o '--strict-undefined --tags "not @dev_only"  --tags "not @ignore" --format json --out reports/parallel.json --format pretty'

  FILE=failed_scenarios.txt
  if [ -f "$FILE" ]; then
    echo "$FILE exits"
    echo '####################################'
    echo 'RETRYING THE FAILED SCENARIOS'
    echo 'FAILED SCENARIOS ARE :'
    cat $FILE
    echo 'FAILED SCENARIOS COUNT: '
    grep -o -i .feature: $FILE | wc -l
    bundle exec cucumber --strict-undefined --format json --out reports/retry_report.json --format pretty $(cat $FILE)
  else
    echo "$FILE does not exits"
  fi
else
  echo "Running tagged scenarios :" " $1"
  bundle exec cucumber --out reports/report.json --format json --tags $1
fi

ruby gen_report.rb
