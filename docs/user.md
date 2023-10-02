# User API Spec

## Register User API

Endpoint : POST /api/users

Request Body :

```json
{
  "username": "johndoe",
  "password": "password",
  "name": "John Doe"
}
```

Response Body Success :

```json
{
  "data": {
    "username": "johndoe",
    "name": "John Doe"
  }
}
```

Response Body Error :

```json
{
  "errors": "Username already registered"
}
```

## Login User API

Endpoint : POST /api/users/login

Request Body :

```json
{
  "username": "johndoe",
  "password": "password"
}
```

Response Body Success :

```json
{
  "data": {
    "token": "unique-token"
  }
}
```

Response Body Error :

```json
{
  "errors": "Username or password is incorrect"
}
```

## Update User API

Endpoint : PATCH /api/users/current

Headers :

- Authorization : token

Request Body :

```json
{
  "name": "John Doe", // Optional
  "password": "new password" // Optional
}
```

Response Body Success :

```json
{
  "data": {
    "username": "johndoe",
    "name": "John Doe"
  }
}
```

Response Body Error :

```json
{
  "errors": "Name length max 100"
}
```

## Get User API

Endpoint: GET /api/users/current

Headers :

- Authorization : token

Response Body Success :

```json
{
  "data": {
    "username": "johndoe",
    "name": "John Doe"
  }
}
```

Response Body Error :

```json
{
  "errors": "Unauthorized"
}
```

## Logout User API

Endpoint : DELETE /api/users/logout

Headers :

- Authorization : token

Response Body Success :

```json
{
  "data": "OK"
}
```

Response Body Error :

```json
{
  "errors": "Unauthorized"
}
```
