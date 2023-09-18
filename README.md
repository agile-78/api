# This is a student project by which we try to solve the problem of recycling

## This is done by Team 78

Thar Lin Shwe
Harsha Vardhini Boopathi
Wong Yuan Jie, Jeremy
Jia Min Sylvia Bay

## To get started you must install docker, node and run respective commands in the terminal for each environment: test, prod and dev

Before that don't forget to creat **.env** file in the root folder

```bash
MONGO_INITDB_ROOT_USERNAME=tls
MONGO_INITDB_ROOT_PASSWORD=password
PORT=3000
MONGO_PORT=27017
MONGO_IP=mongo
COMPOSE_PROJECT_NAME=recyclequest
```

### test

```bash
npm run docker-test
```

or in window

```bash
docker-compose -f docker-compose.yml -f docker-compose.test.yml up --build -d run api npm run test
```

### dev

```bash
npm run docker-dev
```

or in window

```bash
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build -d
```

### prod

```bash
npm run docker-prod
```

or in window

```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up --build -d
```

### It is recommended to run in a **linux** environment. Otherwise, you may face _cors_ error.
