#!/bin/bash

ssh -t root@tb "/projects/php/ptlweb/config/scripts/backupLiveDatabaseTemp.sh && exit;"
scp root@tb:/tmp/ptl.sql.gz /tmp/ptl.sql.gz
gunzip -f /tmp/ptl.sql.gz
sed -i '' '1s/\/\*\!999999\\- enable the sandbox mode \*\///' /tmp/ptl.sql

/Applications/XAMPP/xamppfiles/bin/mysql -u root -e "DROP DATABASE ptl_dev"
/Applications/XAMPP/xamppfiles/bin/mysql -u root -e "CREATE DATABASE ptl_dev"
/Applications/XAMPP/xamppfiles/bin/mysql -u root ptl_dev < /tmp/ptl.sql

rm /tmp/ptl.sql
