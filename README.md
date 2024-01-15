# API Documentation

## Users

### POST /api/users/create

Create a new user.

#### Resource Information

| Method | URL                              | Requires Authentication |
|--------|----------------------------------|-------------------------|
| POST | `https://<domain>/api/users/create` | No |

#### Request

##### Request Header

##### Request Body (JSON)

| Property Name | Type | Required | Description |
| ------------- | ---- | -------- | ----------- |
| name | ``String`` |
| email | ``String`` |
| password | ``String`` |

#### Response

***TODO ...***

#### Resource Errors

| HTTP Code | Error Message |
| --- | ----------------------- |
| 400 | User Already Registered |
| 500 | User Creation Error |
| ***TODO*** | ... |

#### Example

```console
curl - X POST 'https://<domain>/api/users/create' \
    - H "Content-Type: application/json" \
    - d '{"name":"John Doe", "email":"johndoe@example.com" "password":"123456789"}'
```

##### Response

```json
Created User Successfully!
```

### GET /api/users/login

Register a new Login

#### Resources Information

| Method | URL                              | Requires Authentication |
|--------|----------------------------------|-------------------------|
| GET | `https.//<domain>/api/users/login` | Yes |

#### Request Body

| Parameter | Type |
| --------- | ---- |
| email | ``String`` |
| password | ``String`` |

#### Response

***TODO***

| Parameter | Type |
| --------- | ---- |
| token | ``String`` |

#### Resource Errors

***TODO***

#### Example

```console
curl - X GET 'https://<domain>/api/users/login' \
    - H "Content-Type: application/json" \
    - d '{"email": "johndoe@example.com" "password": "123456789"}'
```

##### Response

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NWExMThhNmUxMGRlYmEzMGI1NjFkMjUiLCJpc0FkbWluIjp0cnVlLCJpYXQiOjE3MDUwNTY0MjJ9.LR80nzTrTdVAe7X_yRVNiYLH_Kz4l_pQTjpBj7QAyyA"
}
```

### GET /api/users/me

Get information about current user

#### Resource Information

| Method | URL                              | Requires Authentication |
|--------|----------------------------------|-------------------------|
| GET | `https://<domain>/api/users/me` | Yes |

#### Request Body

| Parameter | Type |
| --------- | ---- |
| email | ``String`` |
| password | ``String`` |

#### Response

| Parameter | Type |
| --------- | ---- |
| _id | ``String`` |
| name | ``String`` |
| email | ``String`` |
| isAdmin | ``Boolean`` |

#### Resource Errors

***TODO ...***

#### Example

```console
curl -X GET https://<domain>/api/users/me \
  -H "Content-Type: application/json" \
  -d '{"password":"John Doe", "email":"johndoe@example.com"}'
```

##### Response

```json
{
  "_id": "65a54be1e4f487510fefccd5",
  "name": "user test",
  "email": "johndoe@example.com",
  "isAdmin": true
}
```

### GET /api/users/all

List all the registered users in the Database.

#### Resource Information

| Method | URL                              | Requires Authentication |
|--------|----------------------------------|-------------------------|
| GET | `https://<domain>/api/users/all` | Yes |

#### Request Body

| Parameter | Type |
| --------- | ---- |
| email | ``String`` |
| password | ``String`` |

#### Response

| Parameter | Type |
| --------- | ---- |
| users | ``Array`` |

#### Resource Errors

| HTTP Code | Error Message |
| --- | ----------------------- |
| ***TODO*** | ... |

#### Example

```console
curl -X GET https://<domain>/api/users/all \
  -H "Content-Type: application/json" \
  -d '{"password":"John Doe", "email":"johndoe@example.com"}'
```

##### Response

```json
{
  "users":[
    {
      "_id": "65a118a6e10deba30b561d25",
      "name": "John Doe",
      "email": "johndoe@example.com",
      "isAdmin":true
    },
    {
      "_id": "65a54be1e4f487510fefccd5",
      "name": "Jannine Doe",
      "email": "janninedoe@example.com",
      "isAdmin": true
    }
  ]
}
```

### GET /api/users/dashboard

***TODO***

## Uploads

### POST /api/uploads/start

Start Uploading the `.csv` file to the server.

#### Resource Information

| Method | URL                              | Requires Authentication | Requires Authorization |
|--------|----------------------------------|----------------------------------|-------------------------|
| POST | `https://<domain>/api/uploads/start` | Yes | Yes |

#### Request Body


#### Response


#### Resource Errors

***TODO ...***

#### Example

```console
curl -X POST https://<domain>/api/uploads/start \
  -H "Content-Type: application/json" \
  -d '{"password":"John Doe", "email":"johndoe@example.com"}'
```

##### Response

```json
{
  "_id": "65a54be1e4f487510fefccd5",
  "name": "user test",
  "email": "johndoe@example.com",
  "isAdmin": true
}
```

### GET /api/users/all

List all the registered users in the Database.

#### Resource Information

| Method | URL                              | Requires Authentication |
|--------|----------------------------------|-------------------------|
| GET | `https://<domain>/api/users/all` | Yes |

#### Request Body

| Parameter | Type |
| --------- | ---- |
| email | ``String`` |
| password | ``String`` |

#### Response

| Parameter | Type |
| --------- | ---- |
| users | ``Array`` |

#### Resource Errors

| HTTP Code | Error Message |
| --- | ----------------------- |
| ***TODO*** | ... |

#### Example

```console
curl -X GET https://<domain>/api/users/all \
  -H "Content-Type: application/json" \
  -d '{"password":"John Doe", "email":"johndoe@example.com"}'
```

##### Response

```json
{
  "users":[
    {
      "_id": "65a118a6e10deba30b561d25",
      "name": "John Doe",
      "email": "johndoe@example.com",
      "isAdmin":true
    },
    {
      "_id": "65a54be1e4f487510fefccd5",
      "name": "Jannine Doe",
      "email": "janninedoe@example.com",
      "isAdmin": true
    }
  ]
}
```

### GET /api/uploads/check-progress

## Inserts

### POST /api/inserts/start

### GET /api/inserts/check-progress

### DELETE /api/inserts/undo

## Mappings

### POST /api/mappings/new

### GET /api/mappings/:id
