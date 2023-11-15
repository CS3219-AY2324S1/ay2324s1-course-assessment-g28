#!/bin/bash

# Check if the email argument is provided
if [ $# -eq 0 ]; then
    echo "Please provide the email as an argument."
    exit 1
fi

# Check if the password argument is provided
if [ $# -eq 1 ]; then
    echo "Please provide the password as an argument."
    exit 1
fi

# Run the command
PGPASSWORD=$2 psql -h 34.87.4.15 -U peerprep -d user -c "UPDATE Users SET is_admin=TRUE WHERE email='$1'; SELECT * FROM Users WHERE email ='$1';"
