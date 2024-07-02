# Loops JavaScript/TypeScript SDK

## Introduction

This is the official JavaScript SDK for [Loops](https://loops.so), with full TypeScript support.

It lets you easily integrate with the Loops API in any JavaScript project.

## Installation

You can install the package [from npm](https://www.npmjs.com/package/loops):

```bash
npm install loops
```

Minimum Node version required: 18.0.0.

You will need a Loops API key to use the package.

In your Loops account, go to the [API Settings page](https://app.loops.so/settings?page=api) and click "Generate key".

Copy this key and save it in your application code (for example as `LOOPS_API_KEY` in an `.env` file).

See the API documentation to learn more about [rate limiting](https://loops.so/docs/api-reference#rate-limiting) and [error handling](https://loops.so/docs/api-reference#debugging).

## Usage

```javascript
import { LoopsClient } from "loops";

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

## Custom contact properties

You can use custom contact properties in API calls. Please make sure to [add custom properties](https://loops.so/docs/contacts/properties#custom-contact-properties) in your Loops account before using them with the SDK.

## Methods

- [createContact()](#createcontact)
- [updateContact()](#updatecontact)
- [findContact()](#findcontact)
- [deleteContact()](#deletecontact)
- [getMailingLists()](#getmailinglists)
- [sendEvent()](#sendevent)
- [sendTransactionalEmail()](#sendtransactionalemail)
- [getCustomFields()](#getcustomfields)

---

### createContact()

Create a new contact.

[API Reference](https://loops.so/docs/api-reference/create-contact)

#### Parameters

| Name           | Type   | Required | Notes                                                                                                                                                                                                                                                                                                                                                                                     |
| -------------- | ------ | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `email`        | string | Yes      | If a contact already exists with this email address, an error response will be returned.                                                                                                                                                                                                                                                                                                  |
| `properties`   | object | No       | An object containing default and any custom properties for your contact.<br />Please [add custom properties](https://loops.so/docs/contacts/properties#custom-contact-properties) in your Loops account before using them with the SDK.<br />Values can be of type `string`, `number`, `boolean` or `date` ([see allowed date formats](https://loops.so/docs/contacts/properties#dates)). |
| `mailingLists` | object | No       | An object of mailing list IDs and boolean subscription statuses.                                                                                                                                                                                                                                                                                                                          |

#### Examples

```javascript
const resp = await loops.createContact("hello@gmail.com");

const contactProperties = {
  firstName: "Bob" /* Default property */,
  favoriteColor: "Red" /* Custom property */,
};
const mailingLists = {
  list_123: true,
  list_456: false,
};
const resp = await loops.createContact(
  "hello@gmail.com",
  contactProperties,
  mailingLists
);
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

| Name           | Type   | Required | Notes                                                                                                                                                                                                                                                                                                                                                                                     |
| -------------- | ------ | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `email`        | string | Yes      | The email address of the contact to update. If there is no contact with this email address, a new contact will be created using the email and properties in this request.                                                                                                                                                                                                                 |
| `properties`   | object | No       | An object containing default and any custom properties for your contact.<br />Please [add custom properties](https://loops.so/docs/contacts/properties#custom-contact-properties) in your Loops account before using them with the SDK.<br />Values can be of type `string`, `number`, `boolean` or `date` ([see allowed date formats](https://loops.so/docs/contacts/properties#dates)). |
| `mailingLists` | object | No       | An object of mailing list IDs and boolean subscription statuses.                                                                                                                                                                                                                                                                                                                          |

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

Find a contact.

[API Reference](https://loops.so/docs/api-reference/find-contact)

#### Parameters

You must use one parameter in the request.

| Name     | Type   | Required | Notes |
| -------- | ------ | -------- | ----- |
| `email`  | string | No       |       |
| `userId` | string | No       |       |

#### Examples

```javascript
const resp = await loops.findContact({ email: "hello@gmail.com" });

const resp = await loops.findContact({ userId: "12345" });
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
    "userId": "12345",
    "favoriteColor": "Blue" /* Custom property */
  }
]
```

---

### deleteContact()

Delete a contact, either by email address or `userId`.

[API Reference](https://loops.so/docs/api-reference/delete-contact)

#### Parameters

You must use one parameter in the request.

| Name     | Type   | Required | Notes |
| -------- | ------ | -------- | ----- |
| `email`  | string | No       |       |
| `userId` | string | No       |       |

#### Example

```javascript
const resp = await loops.deleteContact({ email: "hello@gmail.com" });

const resp = await loops.deleteContact({ userId: "12345" });
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

### getMailingLists()

Get a list of your account's mailing lists. [Read more about mailing lists](https://loops.so/docs/contacts/mailing-lists)

[API Reference](https://loops.so/docs/api-reference/list-mailing-lists)

#### Parameters

None

#### Example

```javascript
const resp = await loops.getMailingLists();
```

#### Response

This method will return a list of mailing list objects containing `id` and `name` attributes.

If your account has no mailing lists, an empty list will be returned.

```json
[
  {
    "id": "list_123",
    "name": "Main list"
  },
  {
    "id": "list_456",
    "name": "Investors"
  }
]
```

---

### sendEvent()

Send an event to trigger an email in Loops. [Read more about events](https://loops.so/docs/events)

[API Reference](https://loops.so/docs/api-reference/send-event)

#### Parameters

| Name                | Type   | Required | Notes                                                                                                                                                                                                                                                                                                                                                                                                                               |
| ------------------- | ------ | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `email`             | string | No       | The contact's email address. Required if `userId` is not present.                                                                                                                                                                                                                                                                                                                                                                   |
| `userId`            | string | No       | The contact's unique user ID. If you use `userID` without `email`, this value must have already been added to your contact in Loops. Required if `email` is not present.                                                                                                                                                                                                                                                            |
| `eventName`         | string | Yes      |                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `contactProperties` | object | No       | An object containing contact properties, which will be updated or added to the contact when the event is received.<br />Please [add custom properties](https://loops.so/docs/contacts/properties#custom-contact-properties) in your Loops account before using them with the SDK.<br />Values can be of type `string`, `number`, `boolean` or `date` ([see allowed date formats](https://loops.so/docs/contacts/properties#dates)). |
| `eventProperties`   | object | No       | An object containing event properties, which will be made availabe in emails that are triggered by this event.<br />Values can be of type `string`, `number`, `boolean` or `date` ([see allowed date formats](https://loops.so/docs/events/properties#important-information-about-event-properties)).                                                                                                                               |
| `mailingLists`      | object | No       | An object of mailing list IDs and boolean subscription statuses.                                                                                                                                                                                                                                                                                                                                                                    |

#### Examples

```javascript
const resp = await loops.sendEvent({
  email: "hello@gmail.com",
  eventName: "signup",
});

const resp = await loops.sendEvent({
  email: "hello@gmail.com",
  eventName: "signup",
  eventProperties: {
    username: "user1234",
    signupDate: "2024-03-21T10:09:23Z",
  },
  mailingLists: {
    list_123: true,
    list_456: false,
  },
});

// In this case with both email and userId present, the system will look for a contact with either a
//  matching `email` or `userId` value.
// If a contact is found for one of the values (e.g. `email`), the other value (e.g. `userId`) will be updated.
// If a contact is not found, a new contact will be created using both `email` and `userId` values.
// Any values added in `contactProperties` will also be updated on the contact.
const resp = await loops.sendEvent({
  userId: "1234567890",
  email: "hello@gmail.com",
  eventName: "signup",
  contactProperties: {
    firstName: "Bob",
    plan: "pro",
  },
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
  "success": false,
  "message": "An error message here."
}
```

---

### sendTransactionalEmail()

Send a transactional email to a contact. [Learn about sending transactional email](https://loops.so/docs/transactional/guide)

[API Reference](https://loops.so/docs/api-reference/send-transactional-email)

#### Parameters

| Name                        | Type     | Required | Notes                                                                                                                                                                                            |
| --------------------------- | -------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `transactionalId`           | string   | Yes      | The ID of the transactional email to send.                                                                                                                                                       |
| `email`                     | string   | Yes      | The email address of the recipient.                                                                                                                                                              |
| `addToAudience`             | boolean  | No       | If `true`, a contact will be created in your audience using the `email` value (if a matching contact doesn’t already exist).                                                                     |
| `dataVariables`             | object   | No       | An object containing data as defined by the data variables added to the transactional email template.<br />Values can be of type `string` or `number`.                                           |
| `attachments`               | object[] | No       | A list of attachments objects.<br />**Please note**: Attachments need to be enabled on your account before using them with the API. [Read more](https://loops.so/docs/transactional/attachments) |
| `attachments[].filename`    | string   | No       | The name of the file, shown in email clients.                                                                                                                                                    |
| `attachments[].contentType` | string   | No       | The MIME type of the file.                                                                                                                                                                       |
| `attachments[].data`        | string   | No       | The base64-encoded content of the file.                                                                                                                                                          |

#### Examples

```javascript
const dataVariables = {
  loginUrl: "https://myapp.com/login/",
};
const resp = await loops.sendTransactionalEmail(
  "clfq6dinn000yl70fgwwyp82l",
  "hello@gmail.com",
  dataVariables
);

// Please contact us to enable attachments on your account.
const attachments = [
  {
    filename: "presentation.pdf",
    contentType: "application/pdf",
    data: "JVBERi0xLjMKJcTl8uXrp/Og0MTGCjQgMCBvYmoKPD...",
  },
];
const resp = await loops.sendTransactionalEmail(
  "clfq6dinn000yl70fgwwyp82l",
  "hello@gmail.com",
  dataVariables,
  attachments
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

Get a list of your account's custom fields. These are custom properties that can be added to contacts to store extra data. [Read more about contact properties](https://loops.so/docs/contacts/properties)

[API Reference](https://loops.so/docs/api-reference/list-custom-fields)

#### Parameters

None

#### Example

```javascript
const resp = await loops.getCustomFields();
```

#### Response

This method will return a list of custom field objects containing `key`, `label` and `type` attributes.

If your account has no custom fields, an empty list will be returned.

```json
[
  {
    "key": "favoriteColor",
    "label": "Favorite Color",
    "type": "string"
  },
  {
    "key": "plan",
    "label": "Plan",
    "type": "string"
  }
]
```

---

## Version history

- `v2.2.0` (Jul 2, 2024) - Added new `addToAudience` option to [`sendTransactionalEmail()`](#sendtransactionalemail).
- `v2.1.1` (Jun 20, 2024) - Added support for mailing lists in [`createContact()`](#createcontact), [`updateContact()`](#updatecontact) and [`sendEvent()`](#sendevent).
- `v2.1.0` (Jun 19, 2024) - Added support for new [List mailing lists](#getmailinglists) endpoint.
- `v2.0.0` (Apr 19, 2024)
  - Added `userId` as a parameter to [`findContact()`](#findcontact). This includes a breaking change for the `findContact()` parameters.
  - `userId` values must now be strings (could have also been numbers previously).
- `v1.0.1` (Apr 1, 2024) - Fixed types for `sendEvent()`.
- `v1.0.0` (Mar 28, 2024) - Fix for ESM types. Switched to named export.
- `v0.4.0` (Mar 22, 2024) - Support for new `eventProperties` in [`sendEvent()`](#sendevent). This includes a breaking change for the `sendEvent()` parameters.
- `v0.3.0` (Feb 22, 2024) - Updated minimum Node version to 18.0.0.
- `v0.2.1` (Feb 6, 2024) - Fix for ESM imports.
- `v0.2.0` (Feb 1, 2024) - CommonJS support.
- `v0.1.5` (Jan 25, 2024) - `getCustomFields()` now returns `type` values for each contact property.
- `v0.1.4` (Jan 25, 2024) - Added support for `userId` in [`sendEvent()`](#sendevent) request. Added missing error response type for `sendEvent()` requests.
- `v0.1.3` (Dec 8, 2023) - Added support for transactional attachments.
- `v0.1.2` (Dec 6, 2023) - Improved transactional error types.
- `v0.1.1` (Nov 1, 2023) - Initial release.
