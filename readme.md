# Numerokeno

## Running the app

Start Angular frontend
```sh
cd ./oma-front
npm start
```

Start flask backend
```sh
cd ./oma-backend
python app.py
```

Start mongo database container (or mongo client locally)
```sh
docker run --name mongodb -p 27017:27017 -d mongo:3.6.8-stretch
```