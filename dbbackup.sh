# /bin/bash
# Description: Backup sqlite database file

# date format: YYYY-MM-DD_HH-MM-SS
date=$(date '+%Y-%m-%d_%H-%M-%S')
purple='\033[0;35m'
reset='\033[0m' # reset color

cp ./database/network.sqlite "./database/network.sqlite.${date}"

# q: how to color output?
# a: https://stackoverflow.com/questions/5947742/how-to-change-the-output-color-of-echo-in-linux
echo "Backup created in: $purple$(pwd)/database/network.sqlite.$date $reset"
