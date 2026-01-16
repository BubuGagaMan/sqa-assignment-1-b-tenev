Step 1: Update and Install

First, refresh your package index and install the PostgreSQL package along with contrib (which adds some helpful utilities).
Bash

sudo apt update
sudo apt install postgresql postgresql-contrib

Step 2: Start and Enable the Service

Once installed, ensure the database service is running and set it to start automatically if the server reboots.
Bash

# Start the service
sudo systemctl start postgresql.service

# Enable it to start on boot
sudo systemctl enable postgresql.service

To verify everything is working, check the status:
Bash

sudo systemctl status postgresql

You should see a green "Active: active (exited)" or "active (running)" status.
Step 3: Accessing the PostgreSQL Shell

By default, Postgres creates a Linux system user named postgres. To access the database, you must switch to this user.

Method A: Switch User and Enter Shell (Recommended)
Bash

# Switch to the postgres user
sudo -i -u postgres

# Open the Postgres prompt
psql

Your terminal prompt should change to postgres=#, indicating you are now logged into the database.

Method B: One-line Command
Bash

sudo -u postgres psql

Step 4: Creating a User and Database

It is best practice not to use the default postgres user for your applications. Instead, create a dedicated user and database.

Run the following SQL commands inside the postgres=# prompt:

1. Create a new user with a password:
SQL

CREATE USER my_user WITH PASSWORD 'secure_password';

2. Create a new database:
SQL

CREATE DATABASE my_database;

3. Grant privileges (Connect user to database):
SQL

GRANT ALL PRIVILEGES ON DATABASE my_database TO my_user;

4. Exit the Postgres shell:
SQL

\q

(Note: To exit the postgres Linux user shell afterwards, type exit).
Step 5: Verify Your Connection

Now, try connecting to your new specific database with your new user to make sure everything works.
Bash

psql -d my_database -U my_user -h localhost -W

    -d: Database name

    -U: Username

    -h: Host (localhost)

    -W: Prompt for password

If you can log in, your database is successfully up and running!
