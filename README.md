<p align="center">
  <a href="http://github.com/winterrdog/" target="blank"><img src="./assets/bike-kick-push-scooter-svgrepo-com.svg" width="200" alt="high-ride Logo" /></a>
</p>

  <p align="center">A simplified ride-sharing backend RESTFUL API developed in NestJS, which includes features like user registration, ride requests, and driver availability management. </p>
    <p align="center">

## Description
`high-ride-api` is a simplified ride-sharing backend API developed in NestJS, which includes features like user registration, ride requests, and driver availability management. The API is developed using NestJS, a progressive Node.js framework for building efficient, reliable, and scalable server-side applications. It uses `MongoDB` as the database service and is developed using TypeScript. 

The API takes in the data in `JSON` format and returns the data in `JSON` format as well.

## Requirements
- `NodeJS`( `>= 16.0.0` )
- `MongoDB`( `>= 4.4.6` )
- `npm`( `>= 7.10.0` )
- `Git`( `>= 2.25.1` )
- `Postman`( `>= 8.10.0` ) or any other API testing tool e.g. `Insomnia`, `HTTPie`( _I used this for testing the API_ ), etc.

## Installation of NodeJS
- Follow the instructions given [here](https://nodejs.org/en/download) to install NodeJS on your system.

## Installation of MongoDB
- Follow the instructions given [here](https://www.mongodb.com/docs/manual/administration/install-community/) to install MongoDB on your system.

## Setting up database service
- Create a `.env` file in the root directory of the project.
- Copy the contents of `.env.example` to `.env` file.
- Replace the value of `JWT_SECRET` to a random( _but secure_ ) string of your choice. This will be used to sign the JWT tokens.
- By default, the database service is configured to run on `mongodb://localhost:27017/high-ride-api` which won't need any authentication. If you want to change the database service URL, replace the value of `DB_URI` in `.env` file.
- On `Unix`, start the MongoDB service.
  ```sh
  sudo systemctl start mongod
  ```
- On `Windows`, in order to start the MongoDB service, follow the instructions given [here](https://medium.com/stackfame/run-mongodb-as-a-service-in-windows-b0acd3a4b712) or [here](https://stackoverflow.com/a/37548118/16357751).

## Setting up the project
- Clone the repository.
  ```sh
  git clone https://github.com/winterrdog/high-ride-api.git
  ```
- Navigate to the project's root directory.
  ```sh
  cd high-ride-api
  ```
- Install the dependencies.
  ```sh
  $ npm i
  ```

## Running the app
- By default, the app is configured to run on `http://localhost:5000`. If you want to change the port, replace the value of `PORT` in your `.env` file.

  ```bash
  # development mode
  $ npm start

  # watch mode
  $ npm run start:dev

  # production mode
  $ npm run start:prod
  ```

## Routes and their description
### User management routes
- `POST /user/register` - Register a new user. _Accessible to everyone_. Send a `POST` request with the following data in `JSON` format.
  ```json
  {
    "firstName": "John",
    "lastName": "Doe",
    "email": "johndoe@gmail.com",
    "password": "johndoe123",
    "phoneNumber": "07000000000",
    "role": "passenger"
  }
  ```
  The `role` field can be either `passenger` or `driver`.

  The server will respond with the registered user and a JWT token. Status code `201` will be returned if the user is successfully registered.

- `GET /user/profile` - Get the profile of the logged-in user. _Only authenticated users can access this route_.
The server will return the profile of the logged-in user. Status code `200` will be returned if the user is successfully fetched. For instance:
  ```json
  {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john23@example.com",
    "phoneNumber": "1234567890",
    "role": "driver",
    "driverStatus": "not applicable",
    "id": "64eb94ca0a86e88cd4d80944",
    "dateCreated": "2023-08-27T18:24:10.598Z",
    "lastModified": "2023-08-27T18:24:10.598Z"
  }
  ```
- `PATCH /user/profile/driver` - Update the profile of the logged-in user who's a `driver` roles. _Only authenticated `driver` role users can access this route_.
Send a `PATCH` request with the following data in `JSON` format.
  ```json
  {
    "driverStatus": "available"
  }
  ```
  The `driverStatus` field can be either `available` or `unavailable`.

  The server will respond with the updated profile of the logged-in user. Status code `200` will be returned if the user is successfully updated. For instance:
  ```json
    {
      "firstName": "John",
      "lastName": "Doe",
      "email": "john23@example.com",
      "phoneNumber": "1234567890",
      "role": "driver",
      "driverStatus": "available",
      "id": "64eb94ca0a86e88cd4d80944",
      "dateCreated": "2023-08-27T18:24:10.598Z",
      "lastModified": "2023-08-27T18:24:10.598Z"
    }
  ```

### Ride management routes
- `GET /rides/` - Get the list of all available rides. Only authenticated `driver` role users can access this route. The server will return the list of all available rides. Status code `200` will be returned if the rides are successfully fetched otherwise it'll return a `404`. For instance:
  ```json
    [ 
      {
        "passenger": {
          "firstName": "Lyndon",
          "lastName": "Darren",
          "email": "lyndon@example.com",
          "phoneNumber": "1234567890",
          "role": "passenger",
          "driverStatus": "not applicable",
          "id": "64ec26c23ef09575c4838c64"
        },
        "driver": null,
        "pickUpLocation": {
          "latitude": 37.7749,
          "longitude": -122.4194,
          "locationName": "San Francisco",
          "country": "United States"
        },
        "dropOffLocation": {
          "latitude": 34.0522,
          "longitude": -118.2437,
          "locationName": "Los Angeles",
          "country": "United States"
        },
        "rideStatus": "accepted",
        "createdAt": "2023-08-28T04:50:22.223Z",
        "updatedAt": "2023-08-28T09:14:29.816Z",
        "id": "64ec278e855903b8781efbc8"
      }
  ]
  ```

  The driver field will be `null` if the ride is **not** accepted by any driver. Otherwise, it'll contain the driver's profile like in this case:
  ```json
    {
      "passenger": {
        "firstName": "Lyndon",
        "lastName": "Darren",
        "email": "lyndon@example.com",
        "phoneNumber": "1234567890",
        "role": "passenger",
        "driverStatus": "not applicable",
        "id": "64ec26c23ef09575c4838c64"
      },
      "driver": {
        "firstName": "John",
        "lastName": "Doe",
        "email": "",
        "phoneNumber": "1234567890",
        "role": "driver",
        "driverStatus": "available",
        "id": "64ec26c23ef09575c4838c65"
      },
      "pickUpLocation": {
        "latitude": 37.7749,
        "longitude": -122.4194,
        "locationName": "San Francisco",
        "country": "United States"
      },
      "dropOffLocation": {
        "latitude": 34.0522,
        "longitude": -118.2437,
        "locationName": "Los Angeles",
        "country": "United States"
      },
      "rideStatus": "accepted",
      "createdAt": "2023-08-28T04:50:22.223Z",
      "updatedAt": "2023-08-28T09:14:29.816Z",
      "id": "64ec278e855903b8781efbc8"
    }
  ```

- `POST /rides/` - Create a new ride. Only authenticated `passenger` role users can create a ride. Send a `POST` request with the following data in `JSON` format.
  ```json
  {
    "pickUpLocation": {
      "latitude": 37.7749,
      "longitude": -122.4194,
      "locationName": "San Francisco",
      "country": "United States"
    },
    "dropOffLocation": {
      "latitude": 34.0522,
      "longitude": -118.2437,
      "locationName": "Los Angeles",
      "country": "United States"
    }
  }
  ```
  The server will respond with the created ride. Status code `201` will be returned if the ride is successfully created. For instance:
  ```json
    {
      "passenger": {
        "firstName": "Lyndon",
        "lastName": "Darren",
        "email": "lyndon@example.com",
        "phoneNumber": "1234567890",
        "role": "passenger",
        "driverStatus": "not applicable",
        "id": "64ec26c23ef09575c4838c64"
      },
      "driver": null,
      "pickUpLocation": {
        "latitude": 37.7749,
        "longitude": -122.4194,
        "locationName": "San Francisco",
        "country": "United States"
      },
      "dropOffLocation": {
        "latitude": 34.0522,
        "longitude": -118.2437,
        "locationName": "Los Angeles",
        "country": "United States"
      },
      "rideStatus": "accepted",
      "createdAt": "2023-08-28T04:50:22.223Z",
      "updatedAt": "2023-08-28T09:14:29.816Z",
      "id": "64ec278e855903b8781efbc8"
    }
  ```
- `PATCH /rides/:id` - Update a ride's status. Only authenticated users can update a ride's status. Passengers can only mark rides as `cancelled` and drivers can mark rides as `completed`, `accepted`, and `cancelled`. Send a `PATCH` request with the following data in `JSON` format.
  ```json
  {
    "rideStatus": "cancelled"
  }
  ```
  The `rideStatus` field can be either `cancelled`, `accepted`, or `completed`.

  The server will respond with the updated ride. Status code `200` will be returned if the ride is successfully updated. For instance:
  ```json
    {
      "passenger": {
        "firstName": "Lyndon",
        "lastName": "Darren",
        "email": "lyndon@example.com",
        "phoneNumber": "1234567890",
        "role": "passenger",
        "driverStatus": "not applicable",
        "id": "64ec26c23ef09575c4838c64"
      },
      "driver": null,
      "pickUpLocation": {
        "latitude": 37.7749,
        "longitude": -122.4194,
        "locationName": "San Francisco",
        "country": "United States"
      },
      "dropOffLocation": {
        "latitude": 34.0522,
        "longitude": -118.2437,
        "locationName": "Los Angeles",
        "country": "United States"
      },
      "rideStatus": "cancelled",
      "createdAt": "2023-08-28T04:50:22.223Z",
      "updatedAt": "2023-08-28T09:14:29.816Z",
      "id": "64ec278e855903b8781efbc8"
    }
  ```

  When the ride's accepted, the driver field will contain the driver's profile like in this case:
  ```json
    {
      "passenger": {
        "firstName": "Lyndon",
        "lastName": "Darren",
        "email": "lyndon@example.com",
        "phoneNumber": "1234567890",
        "role": "passenger",
        "driverStatus": "not applicable",
        "id": "64ec26c23ef09575c4838c64"
      },
      "driver": {
        "firstName": "John",
        "lastName": "Doe",
        "email": "john23@example.com",
        "phoneNumber": "1234567890",
        "role": "driver",
        "driverStatus": "available",
        "id": "64ec26c23ef09575c4838c65"
      },
      "pickUpLocation": {
        "latitude": 37.7749,
        "longitude": -122.4194,
        "locationName": "San Francisco",
        "country": "United States"
      },
      "dropOffLocation": {
        "latitude": 34.0522,
        "longitude": -118.2437,
        "locationName": "Los Angeles",
        "country": "United States"
      },
      "rideStatus": "accepted",
      "createdAt": "2023-08-28T04:50:22.223Z",
      "updatedAt": "2023-08-28T09:14:29.816Z",
      "id": "64ec278e855903b8781efbc8"
    }
  ```
  **NOTE**: _A driver can only accept a ride if the driver's status is `available`. If the driver's status is `unavailable`, the server will respond with a `403` status code. A driver can only accept one ride at a time. If the driver tries to accept another ride, the server will respond with a `403` status code_.

  When the ride's _completed_, the driver field will contain the driver's profile like in this case:
  ```json
    {
      "passenger": {
        "firstName": "Lyndon",
        "lastName": "Darren",
        "email": "lyndon@example.com",
        "phoneNumber": "1234567890",
        "role": "passenger",
        "driverStatus": "not applicable",
        "id": "64ec26c23ef09575c4838c64"
      },
      "driver": {
        "firstName": "John",
        "lastName": "Doe",
        "email": "john23@example.com",
        "phoneNumber": "1234567890",
        "role": "driver",
        "driverStatus": "available",
        "id": "64ec26c23ef09575c4838c65"
      },
      "pickUpLocation":
      {
        "latitude": 37.7749,
        "longitude": -122.4194,
        "locationName": "San Francisco",
        "country": "United States"
      },
      "dropOffLocation": {
        "latitude": 34.0522,
        "longitude": -118.2437,
        "locationName": "Los Angeles",
        "country": "United States"
      },
      "rideStatus": "completed",
      "createdAt": "2023-08-28T04:50:22.223Z",
      "updatedAt": "2023-08-28T09:14:29.816Z",
      "id": "64ec278e855903b8781efbc8"
    }
  ```

  When the ride's cancelled, the driver field will still be set to `null` like in this case:
  ```json
    {
      "passenger": {
        "firstName": "Lyndon",
        "lastName": "Darren",
        "email": "lyndon@example.com",
        "phoneNumber": "1234567890",
        "role": "passenger",
        "driverStatus": "not applicable",
        "id": "64ec26c23ef09575c4838c64"
      },
      "driver": null,
      "pickUpLocation": {
        "latitude": 37.7749,
        "longitude": -122.4194,
        "locationName": "San Francisco",
        "country": "United States"
      },
      "dropOffLocation": {
        "latitude": 34.0522,
        "longitude": -118.2437,
        "locationName": "Los Angeles",
        "country": "United States"
      },
      "rideStatus": "cancelled",
      "createdAt": "2023-08-28T04:50:22.223Z",
      "updatedAt": "2023-08-28T09:14:29.816Z",
      "id": "64ec278e855903b8781efbc8"
    }
  ```

**NOTE**: _By default, the database will be **empty**. So you'll need to create a ride first otherwise you'll get `404` error status code with a message `No rides found`_.

## Authentication and Authorization implementation
- Every JWT token will contain the following fields:
  ```json
  {
    "sub": "64ec26c23ef09575c4838c64",
    "role": "passenger",
    "iat": 1629999999,
    "exp": 1630000000
  }
  ```
  The `sub` field will contain the **user's id**, the `role` field will contain the **user's role**, the `iat` field will contain the _time at which the token was issued_, and the `exp` field will contain the _time at which the token will expire_.
- The API uses `JWT` for authentication and authorization. The `JWT` tokens are signed using the `JWT_SECRET` value provided in the `.env` file.
- The API uses `PassportJS` for authentication and authorization. The `PassportJS` strategy used is `JWTStrategy` which is configured in `src/auth/strategies/jwt.strategy.ts` file.
- I chose to use `JWT` for authentication and authorization because it's stateless and can be used in microservices architecture. It's also scales well in case the API needs to be scaled in the future.

## Testing the app
```bash
# run unit tests
$ npm test
```

## License

`high-ride-api` is of [Unlicense](LICENSE).
