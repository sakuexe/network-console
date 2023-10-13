# Network overview console application

Saku Karttunen - 10/2023

## Table of contents:

1. [About](/#About)

   1. [Features](/#Features)
   2. [Technologies used](/#Technologies-used)

2. [How to use](/#How-to-use)

   1. [Configurations](/#Configurations)
      - [Frontend](/#Frontend)
      - [Backend](/#Backend)
   2. [Running the application](/#Running-the-application)
   3. [Client table](/#Client-table)

3. [Database backups](/#Database-backups)

   1. [Restoring the database](/#Restoring-the-database)

4. [Troubleshooting](/#Troubleshooting)

5. [Report](/#Report)
   1. [Frontend](/#Frontend)
   2. [Backend](/#Backend)
   3. [Dockerizing](/#Dockerizing)

<br/>

## About

This is assignment #3 for my Cloud services course. The assignment was to create
a microservice web application that would allow students of HAMK Riihimäki to
view the devices inside of the school lab's network. The application should
also allow for an admin user to add, remove and edit new devices to the network.

This application is dockerized and uses docker-compose to run the application.
So make sure that you have docker installed.

### Features

- View devices in the network
- Add new devices to the network
- Remove devices from the network
- Edit devices in the network
- Log in with admin privileges

### Technologies used

- [Docker](https://www.docker.com/) & Docker-compose (for running the application)
- [Astro](https://astro.build/) (for the frontend)
- Node.js (for the backend)
- [Express.js](https://expressjs.com/) (for the API and serving the database)
- [Sqlite3](https://www.sqlite.org/index.html) (for the database)
- Typescript
- React.js

<br/>

## How to use

This application is basically managed entirely through docker-compose. Here
is the guide on how to customize and run the application.

### Configurations

The application can be modified easily within the `docker-compose.yml` file.
It should include all the necessary configurations for the application.

<br/>

#### **Frontend**

Choose the outside port that you want to use for the application. The default
is `80`. Only change the first value.

```yaml
ports:
  - "80:4321"
```

If you want to change the port that the backend will be accessed in the
containers, you can change the `API_PORT` environment variable. The default
is `5000`.

**If you change this value, you must also remember to change the environment
variable in the backend section as well**

```yaml
environment:
  - API_PORT=5000
  - API_URL=http://backend
```

You can also change the `API_URL` environment variable. This is the URL that
the frontend will use to access the backend. The default is `http://backend`.

**Only change this value if you change the name of the backend container**

<br/>

#### **Backend**

The backend cannot be accessed from the outside. It is only accessible from
within the docker network. Because of this, you really don't need to change
anything other than the admin credentials.

**Remember to change the admin credentials!**

```yaml
environment:
  - ADMIN_USERNAME=admin
  - ADMIN_PASSWORD=admin
```

In the backend, you can change the previously mentioned `API_PORT` environment
variable. The default is `5000`. This is the port that the backend will be
accessed through, in the containers. If you change this value, you must also
change the `API_PORT` environment variable in the frontend section.

It is not recomended to change the `API_PORT` environment variable. Since
it will not affect the host machine at all. It will only have effect
for the internal docker network.

```yaml
environment:
  - API_PORT=5000
```

<br/>

### Running the application

```bash
# get the repository
git clone https://github.com/sakuexe/network-console
cd network-console
# build and run the containers
docker-compose up --build
```

<br/>

### Client table

Check which clients have connected to the main page. The table will show the
IP address and timestamp of the connection.

The table's name is client and is located in the same network.sqlite file as
the devices and admin table.

There is a handy script for getting all of the client data from the database.
This script also can take in an argument of `--today` or `--yesterday`.

```bash
# give the script permissions
chmod u+x ./getclients.sh
# run the script
./getclients.sh
# or
./getclients.sh --today
```

You can also choose the day by yourself. The date must be in the format of
`YYYY-MM-DD`.

```bash
./getclients.sh --date 2023-10-10
# or
./getclients.sh --date $(date +%Y-%m-%d)
```

And of course, you can also parse the output of the script with `grep` or
other STDOUT tools.

```bash
./getclients.sh --today | grep "172.27.0.3"
```

<br/>

## Database backups

The database can be backed up by running the `dbbackup.sh` script. It will
create a backup of the database and store it in the `database/backups` folder.

```bash
chmod u+x dbbackup.sh
./dbbackup.sh
# check the database/backups folder
ls -laF database/backups
```

### Restoring the database

If something goes wrong with the database, you can restore it from a backup.
You can just run the following commands.

```bash
# stop the containers
docker-compose down
# copy the backup file to the backend folder
cp database/backups/network.sqlite.[date] backend/network.sqlite
# start the containers
docker-compose up
```

<br/>

## Troubleshooting

Common error I got was the `Error: database disk image is malformed`.

This error seemed to be caused when I had forgotten to set the initial
state of the database and it's volume duplicate to the same state.
This was an easy error to fix, so if you get the same error, don't worry.

```bash
# stop the containers
docker-compose down
# copy the network.sqlite file from the backend folder to the database folder
cp backend/network.sqlite database/network.sqlite
```

The error should be now fixed. At least so it has been with my limited testing.

<br/>

## Report

Here is a quick report for this assignment. I will go through
the architecture, some of the choices and the technologies used
and what I would do differently.

The architecture of the application consists of two main parts.

- Frontend (Astro)
- Backend (Express.js)

### Frontend

The frontend is a simple Astro MPA (multi-page application) that
uses server side rendering. This is done so that the applictation's
state can be easily managed and the user experience will feel better
and more responsive. The astro application also uses React.js for
some components and the state management. This is done because I
had prior experience with react and it was easier and quicker to
implement instead of using vanilla (async) javascript.

I initially tried to make the frontend completely static, so
that it would be easy to implement and since I have only had
prior experiences with static Astro web pages. I ran into a
problem of rendering the pages based on authentication though,
and therefore switched to server side rendering (SSR). This
was a great choice overall and I have been very happy using
Astro's SSR mode.

I also noticed during the project that I could've built the
entire project on top of astro, since I was using sqlite3 as
the database. Astro provides it's own endpoints that can be
used as an API for communicating with server side code in SSR.
This was a great thing to learn to use though and I will definitely
be using it in the future too.

### Backend

For the backend I used a simple express.js server. I had it work
as an API for the frontend, which would talk to the database as
was needed.

The backend architecture is simple and straight forward. I used
Sqlite3 for the backend, since replicating it, transfering it
and taking backups for it was extremely easy and the project's
scale suited it. The database file rests in the root of the
backend project folder. This way, the backend can easily
communicate with and modify the database.

Thanks to the database being a simple file. It was extremely
easy to mount it to the host machine with the use of docker
volumes. I will explain the dockerization process next.

### Dockerizing the application

The assignment's idea was to make the application into an easily
runnable and confgurable microservice. So dockerizing it was
an important part towards getting to that goal.

Both the frontend and the backend have their own `Dockerfiles`.
This was done so that I could encapsulate the immutable, crucial
and tedious tasks for creating the container images. This also made
it so that the docker-compose file stayed clean and included only
the information that was more crucial for the end user.

The main configuration happens in the `docker-compose.yml` -file
in the root of the project. This file includes things that the
maintainer of the application would find useful. These things
include:

- The container names
- The docker network used
- Volume for the database
- Environment variables

These values are easy to modify, if you wanted to configure
the functionality of the application slightly. The explanations
for all of these are included in the `docker-compose.yml` -file
as comments.

It was important that running the application should be quick,
easy and painless. This is why I wanted to use docker-compose,
since that helps at automating the tasks easy and running the
application itself easy as one command.

```bash
# run and build the containers
docker compose up --build
# stop the containers
docker compose down
```

### Features

The finished application includes many features that were designed
with the main idea of being easy to use, intuitive and reliable.
The assignment it's own requirements listed below and I feel as
the finished application was able to meet arguably all of them.

<details>
  <summary><b>🧩&nbsp;Assignment (in Finnish)</b></summary>

    Tehtävänä on suunnitella ja toteuttaa mikropalveluperiaatteella
    toimiva labran toimintojen ja palveluiden keskitetty hallintasivusto
    tai muu 'konsolinäkymä'. Eli siis webbisivu, jonka voi asettaa esim.
    windows työasemalla oletussivuksi, johon on kerätty kaikki labran
    laitteiden ja työkalujen hallinta-, palvelu- ja toimintakuvaukset
    sekä osoitteet. Tarve on siis suunnitella vähintään ympäristö,
    jossa voidaan eritellä käyttäjäkohtaisesti student/admin toiminnot
    ja saatavat kohteet. Tehtävässä suunnitellaan tähän toimintoon toimiva
    alusta, jonka tuottama / esittämään sivuun voidaan osoittaa labran
    työasemien webbiselainten kotisivu.

    Tehtävässä on myös harkittava millä tavalla dataa tullaan esittämään
    ja mitkä ovat oleelliset tiedot käyttäjälle ja adminille. Tehtävänä
    järjestelmän täytyy olla korkeasti saatava ja vikasietoinen. Järjestelmän
    täytyy seurata latauksia sivulle sekä osoittaa ladattujen clienttien
    tunniste tieto / ip.

    Luotava järjestelmä voi perustua haluamaasi tekniikkaan. Toivomuksena
    ylläpidon helpottamiseksi on jokin tunnettu julkaisujärjestelmä tai alusta.

</details>

- Viewing devices in the network

This was done with a simple, minimalistic device-dashboard as the
index page. The page includes devices with all of their important
details that could be needed for the usecase: Type, Name/Hostname/Make,
Model, IP address, Admin dashboard link, Additional notes and
the last updated date. Along these, the user can use the navigation
buttons at the right side of the devices to navigate between the types
of the devices.

- Add new devices to the network

Adding devices is easy, first you need to log in from the button
on the main page and then click to the "Add a device" button. Either
at the navigation box or at the footer of the page.

This opens a easy to use form for adding a new device to the list.
The form has required values and these are checked with the html form
`required` attribute. The fields for _IP Address_ and _URL_ also
have validation with the use of the `pattern` attribute and regex.

Here are the regular expressions used for these fields.

```
# URL
pattern="^(http|https):\/\/.*"
# IP address
pattern="^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$"
```

These are not the only validations that take place for the values.
Once the form is submitted to the backend, the server checks
the fields the same way that the frontend does. So if the user
tries some funny business and changes the DOM, it won't accept
the submission unless the right values are given.

- Remove and edit devices

If you are logged in into an admin account, the device cards on the
main page will get two new buttons called "Edit" and "Remove".
Clicking these will send you to their own forms, where you can either
edit the informatin or double check and remove the device all together
from the list. These pages also have a "log in check" for if a user
tries to access these pages straight from the URL bar.

- Log in with admin privileges

As mentioned previously, these last two features are only available
if you are logged in as an admin user (the application does not have
any other users than a singular admin user). If you want multiple
admin users, you will have to do it manually with the following
commands.

```bash
# make sure that the containers are down
docker compose down
# open the database file
sqlite3 backend/network.sqlite
# insert values into the table
INSERT INTO admin (username, password) VALUES (
    "username",
    "password",
);
# exit the file and replicate the changes to the database folder
<C-d>
cp backend/network.sqlite database/
```

Once logged in the application will keep the state for it until the
browser is stopped or the user presses the "log out" button on the main page.
This sate is maintained using cookies, which the server keeps checking.

- User logging

The application has a logging system for when the site's main page is visited.
This allows the maintainer to easily check on how many times and which clients
have visited the page.

This user logging can be printed out with the built in `./getclients.sh` script,
which prints out all of the logs from the database. It even has some useful
filtering tools built in (check the guide at the top of the page). This
tool was created with the Linux operating system in mind and integrates
easily with the rest of the tools on the operating system, which you can
use to filter, parse and save the logs.

For example, you can use grep and the `>` operator to save the logs
of a single IP address onto a file.

```bash
./getclients.sh | grep "127.0.0.1" > thisuserlogs.txt
```

- Dynamic dark and light theme

The page respects your choice of OS theme and will change it's colors based
on the user's OS preferences. (With the light theme being the default).
The application was designed with the light theme in mind, which means
that with the limited time of development, some error messages and links
can be harder to read on the dark theme.

- Custom 404 page

The application also has a minimal 404 page, that lets a lost user easily
return to the main page of the app.

<br/>

### Thoughts

This assignment was done completely in the span of two weeks. It is a fullstack
application with a working frontend, backend and a database. It has it's
own tools built with docker and bash and it is easy to use and intuitive.

With the complexity of the application and the timeframe that it had, I
feel pretty proud about it. The application might lack polish in places
and the code isn't the prettiest, but it was made to fix a problem
and at that, it does it's job mighty well.

- What I would do differently

If I had to start this project from scratch, I would create it completely
in Astro using the [Astro Endpoints](https://docs.astro.build/en/core-concepts/endpoints/)
as my API between the database and the frontend. I learned a lot about
astro and express.js during this project and with these tools I feel
a lot more confident. I was also impressed with how much Astro was able
to do, while still staying blazingly fast. Especially since it's a newer
framework and it was advertised to me as a static webiste framework.

I would also take the time to create a very minimal and quick prototype
before starting the work on the actual project. Since when trying out
things, I felt like I was learning a lot more than with just the
theoretical planning that I had done.

- Last words

Overall, this was a great project and I was having so much fun with building,
developing, designing, failing and retrying things in the process.
The end result I feel like I can be proud of with the resources and time
that I had.

I am also glad that I did this project alone, since I was able to do a
lot more hands-on learning since I had to make everything myself. Should
I still use Django if a similiar deadline was coming up and I had to build
a fullstack application like this? Probably.

If there are any development ideas or anything else, add them to the
Github's issues page, or even through pull requests (keep them clean though).
I would gladly take some feedback on this project.

---

Saku Karttunen - 10/2023 - INTIP21A6, HAMK Riihimäki
