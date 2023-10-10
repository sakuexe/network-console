#!/bin/bash

# Parse the command line arguments
while [[ $# -gt 0 ]]; do
  key="$1"

  case $key in
    -t|--today)
      getToday=true
      shift 1
      ;;
    -y|--yesterday)
      getYesterday=true
      shift 1
      ;;
    -d|--date)
      DATE="$2"
      shift 2
      ;;
    *)
      echo "Unknown option: $key" >&2
      exit 1
      ;;
  esac
done

# Check if the SQLite database file exists
DATABASE_FILE="./database/network.sqlite"
if [ ! -f "$DATABASE_FILE" ]; then
  echo "Database file not found: $DATABASE_FILE"
  exit 1
fi

# check which query to execute
if [ -n "$DATE" ]; then
  # Get the specified date
  QUERY="SELECT * FROM client WHERE strftime('%Y-%m-%d', timestamp)='$DATE';"
elif [ -n "$getToday" ]; then
  # Get the current date
  DATE=$(date +%Y-%m-%d)
  QUERY="SELECT * FROM client WHERE strftime('%Y-%m-%d', timestamp)='$DATE';"
elif [ -n "$getYesterday" ]; then
  # Get the previous date
  DATE=$(date -d "yesterday" +%Y-%m-%d)
  QUERY="SELECT * FROM client WHERE strftime('%Y-%m-%d', timestamp)='$DATE';"
else
  # Get all of the client data
  QUERY="SELECT * FROM client"
fi

# Execute the SQLite query and print the result
sqlite3 "$DATABASE_FILE" "$QUERY"
