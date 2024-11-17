#!/bin/bash

# This script is used to deploy the application to the live server.
npx cypress run
git push
