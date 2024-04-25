# FX Trade API

Welcome to the FX Trade API documentation. This API provides endpoints for managing user accounts and performing currency conversions.

## Endpoints

### 1. GET /fx-rates

Retrieves the current foreign exchange rates from an external service.

Rate limit: 5 requests per 5 minutes.

### 2. POST /fx-conversion

Performs a currency conversion based on the provided parameters.

Rate limit: 5 requests per 5 minutes.

Requires the "token" cookie for authentication.


#### Request Body

```json
{
  "quoteId": 12345,
  "fromCurrency": "USD",
  "toCurrency": "JPY",
  "amount": 100
}
```

### 3. POST /user/signup

Allows users to sign up for an account by providing their credentials.

#### Request Body

```json
{
  "name": "string",
  "email": "user@example.com",
  "password": "string"
}
```

Upon successful signup, a cookie named "token" is set.

### 4. POST /user/signin

Allows existing users to sign in to their accounts.

#### Request Body

```json
{
  "email": "user@example.com",
  "password": "string"
}
```

Upon successful signin, a cookie named "token" is set.

### 5. POST /accounts/topup

Allows users to top up funds to their account balances.

Requires the "token" cookie for authentication.

#### Request Body

```json
{
  "currency": "USD",
  "amount": 100
}
```


## 6. GET /accounts/balance

Retrieves the current account balance for the authenticated user.

Requires the "token" cookie for authentication.