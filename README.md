# Stock Benchmark

* `server` contains simple API backed by a Mongo database.
* `client` contains CRA-based React front-end that fetches from the API

## Feature & Description

Stock Benchmark is a website that lets you compare different stock and get information on them.
You will be able to visualise the stocks you have selected with the search bar on the top left corner.
If you like one stock you can add it as a favorite. This will be saved even if you exit the webpage and come back.
You can also see more information about the stock by clicking on its name in the top bar.

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


## Setup AWS Lightsail

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

## Setup deployment within AWS instance

You can also interact with your instance via the web-based CLI provided in the AWS console.

Copy the build artifact of the release off gitlab
If you do not use wget on the AWS machine, you'll have to manually copy the files over with scp

```
scp -r -i 2023-520-<name>.pem <file> bitnami@<address>:~
```

If using wget on AWS, use your private token in the header

```
wget --header "PRIVATE-TOKEN: <private token>" https://gitlab.com/csy3dawson23-24/520/teams/TeamG13-OniChrisCharles/520-project-oni-chris-charles/-/jobs/5639083869/artifacts/raw/release-520-project-oni-chris-charles-v2.0.04-660d4d2c.tar.gz
```

Enter your credientials for gitlab.

Move it to a more readable folder name:

```
mv release-520-project-oni-chris-charles-v2.0.04-660d4d2c 520-project
```

Then extract that archive to a suitable directory.

```
tar -xf release-520-project-oni-chris-charles-v2.0.04-660d4d2c.tar.gz
```

Download the dataset for populating the database, found at the issues for MongoDB API dataset
```
wget --header "PRIVATE-TOKEN: PRIVATE-TOKEN: <private token>" https://gitlab.com/csy3dawson23-24/520/teams/TeamG13-OniChrisCharles/520-project-oni-chris-charles/uploads/349d7b60ebc762e140c20805cf85d426/dataset.zip
```

Unzip the file

```
unzip dataset.zip
```

Move the file into project
```
mv dataset 520-project/server/
```

(Alternately you can set up GitLab ssh keys on the AWS instance to retain priviledge access to clone the repository)

Create a database on the VPS. Mongo is already installed and has an admin db.

```
mongosh admin --username root --password $(cat bitnami_application_password)
```

In mongosh (see https://docs.bitnami.com/aws/infrastructure/mean/configuration/create-database/):

```
// DATABASE_USER and DATABASE_PASSWORD are placeholders that you should change
// getSiblingDB creates a new db without losing conn to existing or some such
use dataset
db.createCollection("dataset")
db = db.getSiblingDB('dataset')
db.createUser( { user: "DATABASE_USER", pwd: "DATABASE_PASSWORD", roles: [ "readWrite", "dbAdmin" ]} )
```

Set up `DB_URI` with local connection string: Sample `server/.env` to set up in production:

```
PORT=3001
CLUSTER_NAME=dataset
DB_URI=mongodb://DATABASE_USER:DATABASE_PASSWORD@127.0.0.1:27017/dataset?directConnection=true&serverSelectionTimeoutMS=2000
```

(note your port may need to be changed, if already in use)
```
db.runCommand({whatsmyuri: 1})
```

Ensure you have the dataset database selected
```
show databases
```

Ensure you have a collection called dataset
```
show collections
```

Ensure your user is created
```
db.system.users.find()
```

Note the `server/bin/www`, `utils/seed.js` and the `utils/delete.js` files. They refer to a collection called `dataset` -- this was already created when we attributed a new database

Once `.env` is configured, run the seeding script:

```
cd 520-project/server/
node utils/seed.js
```

You can verify that the local db now contains some quotes:

```
mongosh "local connection string, same as DB_URI, inside quotation marks"
```

Then in mongosh the following should print a bunch of quote documents:

```
db.dataset.find()
db.dataset.countDocuments()
```

__If you can't get the local db working__: You can use a free-tier db via MongoDB Atlas. In your AWS Instance settings (click on the instance name), go to the Network settings and attach a static IP to your instance. Then add that IP address to your Mongo DB Atlas deployment (under Security > Network Access). Update your `.env` file to set `DB_URI` to the connection string for your Atlas
deployment. Restart your Express app if it was already running. _Take care to your Atlas database for production only. Define/use a different database in development_ 

Next we need to run our server. The instance has [forever](https://www.npmjs.com/package/forever) installed by default

from the 520-project folder

```
cd server
NODE_ENV=production forever start bin/www
```

You can `cat`
the logfile to check if the output is what you expect.

Now we can use `forever list` and so on to control the express app. If we modify the app
(deploy a new version) we need to `forever restart <id>`.

The express app listens on port 3001 but this port isn't exposed on the aws instance.

Configure a simple apache `vhost.conf` in `/opt/bitnami/apache/conf/vhosts/vhost.conf`
to proxy 3001 to 80 (which is open/public on this aws instance)

```
touch /opt/bitnami/apache/conf/vhosts/vhost.conf
```

navigate to the vhost.conf
```
cd  /opt/bitnami/apache/conf/vhosts/vhost.conf
```

Add the following lines

```
<VirtualHost 127.0.0.1:80 _default_:80>
  ProxyPass / http://localhost:3001/
  ProxyPassReverse / http://localhost:3001/
</VirtualHost>
```

You may return back to your user folder
```
cd ~
```

Then restart the Apache service:
```
sudo /opt/bitnami/ctlscript.sh restart apache
```

Now visiting your instance IP should show you the quotes app!

If you run out of memory on the server while users interact with your app, you may upgrade the server.