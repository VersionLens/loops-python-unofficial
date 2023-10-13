# Loops JavaScript/TypeScript SDK

## Introduction

This is the official Javascript SDK for [Loops](https://loops.so), with full TypeScript support.

It lets you easily integrate with the Loops API in any Javascript project.

## Installation

You can install the package from npm:

```bash
npm install @loops/loops
```

You will need a Loops API key to be able to use this package.

In your Loops account, go to [Settings > API](https://app.loops.so/settings?page=api) and click "Generate key".

Copy this key and save it in your application code (for example as `LOOPS_API_KEY` in an `.env` file).

## Usage

```javascript
import LoopsClient from '@loops/loops'

const loops = new LoopsClient(process.env.LOOPS_API_KEY)

const data = await loops.createContact('email@provider.com')
```

## Tip

You can create a new contact when [sending events](#sendevent) and [transactional emails](#sendtransactionalemail). If the email address you provide doesn't exist as a contact, the contact will be created at the same time the event or transactional email is sent.

## Methods

- [createContact()](#createcontact)
- [updateContact()](#updatecontact)
- [findContact()](#findcontact)
- [deleteContact()](#deletecontact)
- [sendEvent()](#sendevent)
- [sendTransactionalEmail()](#sendtransactionalemail)
- [getCustomFields()](#getcustomfields)

### createContact()

Create a new contact.

[API Reference](https://loops.so/docs/api#add).

#### Params

| Name         | Type   | Required | Notes |
|--------------|--------|----------|-------|
| `email`      | string | Yes      |       |
| `properties` | object | No       | An object containing default and any custom properties for your contact. If the custom property key doesn't already exist in your account, it will be created and added to all existing contacts. |

#### Examples

```javascript
const resp = loops.createContact('hello@gmail.com')

const contactProperties = {
  'firstName': 'Bob', // Default property
  'favoriteColor': 'Red' // Custom property
}
const resp = loops.createContact('hello@gmail.com', contactProperties)
```

#### Response

This method will return a success or error message:

```json
{
  "success": true,
  "id": "id_of_contact"
}
```

```json
{
  "success": false,
  "message": "An error message here."
}
```

### updateContact()

Update a contact.

[API Reference](https://loops.so/docs/api#update).

#### Params

| Name         | Type   | Required | Notes |
|--------------|--------|----------|-------|
| `email`      | string | Yes      | The email address of the contact to update. If there is no contact with this email address, a new contact will be created. |
| `properties` | object | No       | An object containing default and any custom properties for your contact. If the custom property key doesn't already exist in your account, it will be created and added to all existing contacts. |

#### Example

```javascript
const contactProperties = {
  'firstName': 'Bob', // Default property
  'favoriteColor': 'Blue' // Custom property
}
const resp = loops.updateContact('hello@gmail.com', contactProperties)
```

#### Response

This method will return a success or error message:

```json
{
  "success": true,
  "id": "id_of_contact"
}
```

```json
{
  "success": false,
  "message": "An error message here."
}
```

### findContact()

Find a contact by email address.

[API Reference](https://loops.so/docs/api#find).

#### Params

| Name    | Type   | Required | Notes |
|---------|--------|----------|-------|
| `email` | string | Yes      |       |

#### Example

```javascript
const resp = loops.findContact('hello@gmail.com')
```

#### Response

This method will return a list of contact objects. If no contact is found, an empty list will be returned.

```json
[
  {
    "id": "cll6b3i8901a9jx0oyktl2m4u",
    "email": "hello@gmail.com",
    "firstName": null,
    "lastName": null,
    "source": "API",
    "subscribed": true,
    "userGroup": "",
    "userId": null,
    "favoriteColor": "Blue"
  }
]
```

### deleteContact()

Delete a contact, either by email address or user ID.

[API Reference](https://loops.so/docs/api#delete).

#### Params

| Name     | Type   | Required | Notes |
|----------|--------|----------|-------|
| `email`  | string | No       |       |
| `userId` | string | No       |       |

#### Example

```javascript
const resp = loops.deleteContact({ email: 'hello@gmail.com' })
```

#### Response

This method will return a success or error message:

```json
{
  "success": true,
  "message": "Contact deleted."
}
```

```json
{
  "success": false,
  "message": "An error message here."
}
```

### sendEvent()

Send an event.

[API Reference](https://loops.so/docs/api#send-event).

#### Params

| Name         | Type   | Required | Notes |
|--------------|--------|----------|-------|
| `email`      | string | Yes      | If there is no contact with this email address, a new contact will be created. |
| `eventName`  | string | Yes      |       |
| `properties` | object | No       | An object containing contact properties, which will be updated or added to the contact when the event is received. |

#### Examples

```javascript
const resp = loops.sendEvent('hello@gmail.com', 'signup')

const contactProperties = {
  'plan': 'pro'
}
const resp = loops.sendEvent('hello@gmail.com', 'signup', contactProperties)
```

#### Response

This method will return a success or error:

```json
{
  "success": true
}
```

```json
{
  "success": false
}
```

### sendTransactionalEmail()

Send a transaction email.

[API Reference](https://loops.so/docs/api#send-transactional-email).

#### Params

| Name              | Type   | Required | Notes |
|-------------------|--------|----------|-------|
| `transactionalId` | string | Yes      | The ID of the transactional email to send. |
| `email`           | string | Yes      | If there is no contact with this email address, a new contact will be created. |
| `dataVariables`   | object | No       | An object containing the data variables as defined by the transational email template. |

#### Example

```javascript
const dataVariables = {
  "loginUrl": "https://myapp.com/login/"
}
const resp = loops.sendTransactionalEmail('clfq6dinn000yl70fgwwyp82l', 'hello@gmail.com', dataVariables)
```

#### Response

This method will return a success or error message.

```json
{
  "success": true
}
```

If there is an error, a descriptive error message will be returned:

```json
{
  "success": false,
  "path": "dataVariables",
  "message": "There are required fields for this email. You need to include a 'dataVariables' object with the required fields."
}
```

```json
{
  "success": false,
  "error": {
    "path": "dataVariables",
    "message": "Missing required fields: login_url"
  },
  "transactionalId": "clfq6dinn000yl70fgwwyp82l"
}
```

### getCustomFields()

Get a list of custom fields.

#### Params

None

#### Example

```javascript
const resp = loops.getCustomFields()
```

#### Response

This method will return a list of custom field objects. If there are no custom fields, an empty list will be returned.

```json
[
  {
    "key": "favoriteColor",
    "label": "Favourite Color"
  },
  {
    "key": "plan",
    "label": "Plan"
  }
]
```