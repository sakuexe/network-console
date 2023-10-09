# Network overview console application

Saku Karttunen - 10/2023

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

## How to use

This application is basically managed entirely through docker-compose. Here
is the guide on how to customize and run the application.

### Configurations

The application can be modified easily within the `docker-compose.yml` file.
It should include all the necessary configurations for the application.

#### Frontend

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

#### Backend

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

### Running the application

```bash
git clone https://github.com/sakuexe/network-console
cd network-console
docker-compose up
```

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
