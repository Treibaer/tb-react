#!/bin/bash

ssh -t root@tb "/projects/php/ptlweb/config/scripts/backupLiveDatabaseTemp.sh && exit;"
scp root@tb:/tmp/ptl.sql.gz /tmp/ptl.sql.gz
gunzip -f /tmp/ptl.sql.gz
sed -i '' '1s/\/\*\!999999\\- enable the sandbox mode \*\///' /tmp/ptl.sql

/Applications/XAMPP/xamppfiles/bin/mysql -u root -e "DROP DATABASE ptl_dev"
/Applications/XAMPP/xamppfiles/bin/mysql -u root -e "CREATE DATABASE ptl_dev"
/Applications/XAMPP/xamppfiles/bin/mysql -u root ptl_dev < /tmp/ptl.sql

# Insert a row into the 'access_token' table for Cypress
/Applications/XAMPP/xamppfiles/bin/mysql -u root -e "
USE ptl_dev;
INSERT INTO access_token (user_id, value, client, last_used, created_at, ip)
VALUES (1, 'abc', '', 0, 0, '');
"
# Insert a test user into the database for Cypress
/Applications/XAMPP/xamppfiles/bin/mysql -u root -e "
USE ptl_dev;
INSERT INTO user (id, first_name, avatar, password, email, created_at, maximized, phone_number, date_of_birth, selected_project_id)
VALUES (NULL, 'TestUser', '', '\$2b\$10\$7JdaVYT/ZGuZ.OwHX.vbQ.wDLGHiUiUxBTIYetjRA1.oEmigMY9yu', 'test@treibaer.de', 0, 0, '', '', 2);
"

rm /tmp/ptl.sql
