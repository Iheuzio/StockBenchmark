# Stock Benchmark

* `server` contains simple API backed by a Mongo database.
* `client` contains CRA-based React front-end that fetches from the API

## Feature & Description

Stock Benchmark is a website that lets you compare different stock and get information on them.
You will be able to visualise the stocks you have selected with

## Prerequisite

Set up a free cluster on MongoDB Atlas or create a local mongo db. 

Create `server/.env` to connect to Atlas. Example:

```
ATLAS_URI=mongodb+srv://USERNAME:PASSWORD@CLUSTERNAME.eyyyyq7.mongodb.net/?retryWrites=true&w=majority
PORT=3001
```

Seed the database with some initial data from root:

```
cd server
npm i
node utils/seed.js
```

## Install dependencies and build react app

From root:

```
cd client
npm i
cd ../server
npm i
```

## Run locally

```
cd server
npm run start
```

## Test API

From root:

```
cd server
npm i
npm test
```

# Deployment on AWS Lightsail (no container)

see [screenshots dir](./screenshots)

Assumes access to <https://dawsoncollege.awsapps.com/start#/> with dawson credentials

Overview: AWS Lightsail instance with local Mongo DB (not using Atlas)

Open AWS Lightsail > Create Instance > Linux > MEAN Stack blueprint

Using [Bitnami MEAN Stack blueprint](https://docs.bitnami.com/aws/infrastructure/mean/) 
because it has Node and Mongo installed.

Before creating an instance, choose __change SSH key pair > create new__: you can have AWS generate a pem file
for you to download. You can use this to ssh into the instance later.

Choose cheapest instance plan

Add a key-value tag (e.g. course=2023-520)

AWS will show your instance in a list. Once it's running, visit the IP to verify that the 
Bitnami example app is being served.

See Lightsail instance info in Lightsail dashboard for how to ssh into your instance. Example:

```
ssh -i ~/2023-520-yourname.pem bitnami@<instance ip>
```

You can also interact with your instance via the web-based CLI provided in the AWS console.


On your dev machine, make a fresh clone of the project (e.g. `quotes_deploy`), and only install production dependencies: `export NODE_ENV=production; cd quotes_deploy; npm run build`

Delete everything from the `client` dir except `client/build` then compress+archive the project dir (e.g. tar.gz) and scp the archive to the AWS instance. 

```
$ scp -r -i 2023-520-yourname.pem <file_to_copy> bitnami@<aws instance ip>:~
```

Then extract that archive to a suitable directory.

(Alternately you can set up GitLab ssh keys on the server to be able to clone this repo and build directly on the server -- you might hit memory limits when you build, though.)

Create a database on the VPS. Mongo is already installed and has an admin db.

```
mongosh admin --username root --password $(cat bitnami_application_password)
```

In mongosh (see https://docs.bitnami.com/aws/infrastructure/mean/configuration/create-database/):

```
// DATABASE_USER and DATABASE_PASSWORD are placeholders that you should change
// getSiblingDB creates a new db without losing conn to existing or some such
db = db.getSiblingDB('quotes_db')
db.createUser( { user: "DATABASE_USER", pwd: "DATABASE_PASSWORD", roles: [ "readWrite", "dbAdmin" ]} )
```

Set up `DB_URI` with local connection string: Sample `server/.env` to set up in production:

```
PORT=3001
CLUSTER_NAME=quotes_db
DB_URI=mongodb://DATABASE_USER:DATABASE_PASSWORD@127.0.0.1:27017/quotes_db?directConnection=true&serverSelectionTimeoutMS=2000
```

In the `quotes_deploy` code that we copied to the server, `server/bin/www` and `utils/seed.js` refer to
a collection called `quotes` -- this will be created in the local db when we run the seeding script.

Once `.env` is configured, run the seeding script:

```
cd quotes_deploy/server/
node utils/seed.js
```

You can verify that the local db now contains some quotes:

```
mongosh "local connection string, same as DB_URI, inside quotation marks"
```

Then in mongosh the following should print a bunch of quote documents:

```
db.quotes.find()
db.quotes.countDocuments()
```

__If you can't get the local db working__: You can use a free-tier db via MongoDB Atlas. In your AWS Instance settings (click on the instance name), go to the Network settings and attach a static IP to your instance. Then add that IP address to your Mongo DB Atlas deployment (under Security > Network Access). Update your `.env` file to set `DB_URI` to the connection string for your Atlas
deployment. Restart your Express app if it was already running. _Take care to your Atlas database for production only. Define/use a different database in development_ 

Next we need to run our server. The instance has [forever](https://www.npmjs.com/package/forever) installed by default

```
cd server
NODE_ENV=production forever start bin/www
```

`forever` may show some warnings (see [this screenshot](screenshots/Screenshot 2023-11-14 at 15-08 forever production.png)) but this is okay. `forever list` should show you that `bin/www` is running and the log file in which its output is saved. You can `cat`
the logfile to check if the output is what you expect.

Now we can use `forever list` and so on to control the express app. If we modify the app
(deploy a new version) we need to `forever restart <id>`.

The express app listens on port 3001 but this port isn't exposed on the aws instance.

Configure a simple apache `vhost.conf` in `/opt/bitnami/apache/conf/vhosts/vhost.conf`
to proxy 3001 to 80 (which is open/public on this aws instance)

```
<VirtualHost 127.0.0.1:80 _default_:80>
  ProxyPass / http://localhost:3001/
  ProxyPassReverse / http://localhost:3001/
</VirtualHost>
```

Then restart the Apache service: `sudo /opt/bitnami/ctlscript.sh restart apache`

Now visiting your instance IP should show you the quotes app!

If you run out of memory on the server while users interact with your app, you may upgrade the server to $5 a month resource package.