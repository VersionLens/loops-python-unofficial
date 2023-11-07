# Loops JavaScript/TypeScript SDK

## Introduction

This is the official JavaScript SDK for [Loops](https://loops.so), with full TypeScript support.

It lets you easily integrate with the Loops API in any JavaScript project.

## Installation

You can install the package [from npm](https://www.npmjs.com/package/loops):

```bash
npm install loops
```

You will need a Loops API key to use the package.

In your Loops account, go to the [API Settings page](https://app.loops.so/settings?page=api) and click "Generate key".

Copy this key and save it in your application code (for example as `LOOPS_API_KEY` in an `.env` file).

See the API documentation to learn more about [rate limiting](https://loops.so/docs/api-reference#rate-limiting) and [error handling](https://loops.so/docs/api-reference#debugging).

## Usage

```javascript
import LoopsClient from "loops";

const loops = new LoopsClient(process.env.LOOPS_API_KEY);

const resp = await loops.createContact("email@provider.com");
```

## Default contact properties

Each contact in Loops has a set of default properties. These will always be returned in API results.

- `id`
- `email`
- `firstName`
- `lastName`
- `source`
- `subscribed`
- `userGroup`
- `userId`

You are able to add custom properties to your contacts when using the API (explained in each method below). Any custom properties will be added to contact objects in API responses.

## Methods

- [createContact()](#createcontact)
- [updateContact()](#updatecontact)
- [findContact()](#findcontact)
- [deleteContact()](#deletecontact)
- [sendEvent()](#sendevent)
- [sendTransactionalEmail()](#sendtransactionalemail)
- [getCustomFields()](#getcustomfields)

---

### createContact()

Create a new contact.

[API Reference](https://loops.so/docs/api-reference/create-contact)

#### Parameters

| Name         | Type   | Required | Notes                                                                                                                                                                                             |
| ------------ | ------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `email`      | string | Yes      | If a contact already exists with this email address, an error response will be returned.                                                                                                          |
| `properties` | object | No       | An object containing default and any custom properties for your contact. If the custom property key doesn't already exist in your account, it will be created and added to all existing contacts. |

#### Examples

```javascript
const resp = await loops.createContact("hello@gmail.com");

const contactProperties = {
  firstName: "Bob" /* Default property */,
  favoriteColor: "Red" /* Custom property */,
};
const resp = await loops.createContact("hello@gmail.com", contactProperties);
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

---

### updateContact()

Update a contact.

Note: To update a contact's email address, the contact requires a `userId` value. Then you can make a request with their `userId` and an updated email address.

[API Reference](https://loops.so/docs/api-reference/update-contact)

#### Parameters

| Name         | Type   | Required | Notes                                                                                                                                                                                             |
| ------------ | ------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `email`      | string | Yes      | The email address of the contact to update. If there is no contact with this email address, a new contact will be created using the email and properties in this request.                         |
| `properties` | object | No       | An object containing default and any custom properties for your contact. If the custom property key doesn't already exist in your account, it will be created and added to all existing contacts. |

#### Example

```javascript
const contactProperties = {
  firstName: "Bob" /* Default property */,
  favoriteColor: "Blue" /* Custom property */,
};
const resp = await loops.updateContact("hello@gmail.com", contactProperties);

/* Updating a contact's email address using userId */
const resp = await loops.updateContact("newemail@gmail.com", {
  userId: "1234",
});
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

---

### findContact()

Find a contact by email address.

[API Reference](https://loops.so/docs/api-reference/find-contact)

#### Parameters

| Name    | Type   | Required | Notes |
| ------- | ------ | -------- | ----- |
| `email` | string | Yes      |       |

#### Example

```javascript
const resp = await loops.findContact("hello@gmail.com");
```

#### Response

This method will return a list containing a single contact object, which will include all default properties and any custom properties.

If no contact is found, an empty list will be returned.

```json
[
  {
    "id": "cll6b3i8901a9jx0oyktl2m4u",
    "email": "hello@gmail.com",
    "firstName": "Bob",
    "lastName": null,
    "source": "API",
    "subscribed": true,
    "userGroup": "",
    "userId": null,
    "favoriteColor": "Blue" /* Custom property */
  }
]
```

---

### deleteContact()

Delete a contact, either by email address or `userId`.

[API Reference](https://loops.so/docs/api-reference/delete-contact)

#### Parameters

| Name     | Type   | Required | Notes |
| -------- | ------ | -------- | ----- |
| `email`  | string | No       |       |
| `userId` | string | No       |       |

#### Example

```javascript
const resp = await loops.deleteContact({ email: "hello@gmail.com" });

const resp = await loops.deleteContact({ userId: "abcd" });
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

---

### sendEvent()

Send an event to trigger an email in Loops. [Read more about triggering emails](https://loops.so/docs/loop-builder/triggering-emails)

[API Reference](https://loops.so/docs/api-reference/send-event)

#### Parameters

| Name         | Type   | Required | Notes                                                                                                              |
| ------------ | ------ | -------- | ------------------------------------------------------------------------------------------------------------------ |
| `email`      | string | Yes      | If there is no contact with this email address, a new contact will be created.                                     |
| `eventName`  | string | Yes      |                                                                                                                    |
| `properties` | object | No       | An object containing contact properties, which will be updated or added to the contact when the event is received. |

#### Examples

```javascript
const resp = await loops.sendEvent("hello@gmail.com", "signup");

const resp = await loops.sendEvent("hello@gmail.com", "signup", {
  firstName: "Bob",
  plan: "pro",
});
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

---

### sendTransactionalEmail()

Send a transactional email to a contact. [Learn about sending transactional email](https://loops.so/docs/transactional/guide)

[API Reference](https://loops.so/docs/api-reference/send-transactional-email)

#### Parameters

| Name              | Type   | Required | Notes                                                                                                         |
| ----------------- | ------ | -------- | ------------------------------------------------------------------------------------------------------------- |
| `transactionalId` | string | Yes      | The ID of the transactional email to send.                                                                    |
| `email`           | string | Yes      | If there is no contact with this email address, a new contact will be created.                                |
| `dataVariables`   | object | No       | An object containing contact data as defined by the data variables added to the transactional email template. |

#### Example

```javascript
const dataVariables = {
  loginUrl: "https://myapp.com/login/",
};
const resp = await loops.sendTransactionalEmail(
  "clfq6dinn000yl70fgwwyp82l",
  "hello@gmail.com",
  dataVariables
);
```

#### Response

This method will return a success or error message.

```json
{
  "success": true
}
```

If there is a problem with the request, a descriptive error message will be returned:

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

---

### getCustomFields()

Get a list of your account's custom fields. These are custom properties that can be added to contacts to store extra data. [Read more about contact properties](https://loops.so/docs/add-users/properties)

[API Reference](https://loops.so/docs/api-reference/list-custom-fields)

#### Parameters

None

#### Example

```javascript
const resp = await loops.getCustomFields();
```

#### Response

This method will return a list of custom field objects containing `key` and `label` attributes.

If there are no custom fields, an empty list will be returned.

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
