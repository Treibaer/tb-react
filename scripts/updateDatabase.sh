#!/bin/bash

ssh -t root@tb "/projects/php/ptlweb/config/scripts/backupLiveDatabaseTemp.sh && exit;"
scp root@tb:/tmp/ptl.sql.gz /tmp/ptl.sql.gz
gunzip -f /tmp/ptl.sql.gz
sed -i '' '1s/\/\*\!999999\\- enable the sandbox mode \*\///' /tmp/ptl.sql

/Applications/XAMPP/xamppfiles/bin/mysql -u root -e "DROP DATABASE ptl_dev"
/Applications/XAMPP/xamppfiles/bin/mysql -u root -e "CREATE DATABASE ptl_dev"
/Applications/XAMPP/xamppfiles/bin/mysql -u root ptl_dev < /tmp/ptl.sql

# Insert a row into the 'access_token' table for cypress testautomation
/Applications/XAMPP/xamppfiles/bin/mysql -u root -e "
USE ptl_dev;
INSERT INTO access_token (user_id, value, client, last_used, created_at, ip)
VALUES (1, 'abc', '', 0, 0, '');
"

rm /tmp/ptl.sql
