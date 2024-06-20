interface QueryOptions {
  path: `v1/${string}`;
  method?: "GET" | "POST" | "PUT";
  payload?: Record<string, any>;
  params?: Record<string, string>;
}

interface ContactSuccessResponse {
  success: true;
  id: string;
}

interface DeleteSuccessResponse {
  success: true;
  message: "Contact deleted.";
}

interface ErrorResponse {
  success: false;
  message: string;
}

type Contact = {
  /**
   * The contact's ID.
   */
  id: string;
  /**
   * The contact's email address.
   */
  email: string;
  /**
   * The contact's first name.
   */
  firstName: string | null;
  /**
   * The contact's last name.
   */
  lastName: string | null;
  /**
   * The source the contact was created from.
   */
  source: string;
  /**
   * Whether the contact will receive campaign and loops emails.
   */
  subscribed: boolean;
  /**
   * The contact's user group (used to segemnt users when sending emails).
   */
  userGroup: string;
  /**
   * A unique user ID (for example, from an external application).
   */
  userId: string | null;
} & Record<string, any>;

interface EventSuccessResponse {
  success: boolean;
}

interface EventErrorResponse {
  success: false;
  message: string;
}

type EventResponse = EventSuccessResponse | EventErrorResponse;

interface TransactionalSuccess {
  success: true;
}

interface TransactionalError {
  type: "error";
  success: false;
  path: string;
  message: string;
}

interface TransactionalNestedError {
  type: "nestedError";
  success: false;
  error: {
    path: string;
    message: string;
  };
  transactionalId?: string;
}

type TransactionalResponse =
  | TransactionalSuccess
  | TransactionalError
  | TransactionalNestedError;

type ContactProperties = Record<string, string | number | boolean>;

type EventProperties = Record<string, string | number | boolean>;

type TransactionalVariables = Record<string, string | number>;

interface TransactionalAttachment {
  /**
   * The file name, shown in email clients.
   */
  filename: string;
  /**
   * MIME type of the file.
   */
  contentType: string;
  /**
   * Base64-encoded content of the file.
   */
  data: string;
}

class LoopsClient {
  apiKey: string;
  apiRoot = "https://app.loops.so/api/";

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Creates and sends a query to the Loops API.
   *
   * @param {Object} params
   * @param {string} params.path Endpoint path
   * @param {string} params.method HTTP method
   * @param {Object} params.payload Payload for PUT and POST requests
   * @param {Object} params.params URL query parameters
   */
  private async _makeQuery({
    path,
    method = "GET",
    payload,
    params,
  }: QueryOptions) {
    const headers = new Headers();
    headers.set("Authorization", `Bearer ${this.apiKey}`);

    const url = new URL(path, this.apiRoot);
    if (params && method === "GET") {
      Object.entries(params).forEach(([key, value]) =>
        url.searchParams.append(key, value)
      );
    }

    try {
      const response = await fetch(url.href, {
        method,
        headers,
        body: payload ? JSON.stringify(payload) : undefined,
      });
      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create a new contact.
   *
   * @param {string} email The email address of the contact.
   * @param {Object} [properties] All other contact properties, including custom properties.
   * @param {Object} [mailingLists] An object of mailing list IDs and boolean subscription statuses.
   *
   * @see https://loops.so/docs/api-reference/create-contact
   *
   * @returns {Object} Contact record or error response (JSON)
   */
  async createContact(
    email: string,
    properties?: ContactProperties,
    mailingLists?: Record<string, boolean>
  ): Promise<ContactSuccessResponse | ErrorResponse> {
    const payload = { email, ...properties, mailingLists };
    return this._makeQuery({
      path: "v1/contacts/create",
      method: "POST",
      payload,
    });
  }

  /**
   * Update a contact.
   *
   * @param {string} email The email address of the contact.
   * @param {Object} properties All other contact properties, including custom properties.
   * @param {Object} [mailingLists] An object of mailing list IDs and boolean subscription statuses.
   *
   * @see https://loops.so/docs/api-reference/update-contact
   *
   * @returns {Object} Contact record or error response (JSON)
   */
  async updateContact(
    email: string,
    properties: ContactProperties,
    mailingLists?: Record<string, boolean>
  ): Promise<ContactSuccessResponse | ErrorResponse> {
    const payload = { email, ...properties, mailingLists };
    return this._makeQuery({
      path: "v1/contacts/update",
      method: "PUT",
      payload,
    });
  }

  /**
   * Find a contact by email address or user ID.
   *
   * @param {Object} params
   * @param {string} [params.email] The email address of the contact.
   * @param {string} [params.userId] The user ID of the contact.
   *
   * @see https://loops.so/docs/api-reference/find-contact
   *
   * @returns {Object} List of contact records (JSON)
   */
  async findContact({
    email,
    userId,
  }: {
    email?: string;
    userId?: string;
  }): Promise<Contact[]> {
    if (email && userId) throw "Only one parameter is permitted.";
    const params: { email?: string; userId?: string } = {};
    if (email) params["email"] = email;
    else if (userId) params["userId"] = userId;
    else throw "You must provide an `email` or `userId` value.";
    return this._makeQuery({
      path: "v1/contacts/find",
      params,
    });
  }

  /**
   * Delete a contact by email or user ID.
   *
   * @param {Object} params
   * @param {string} [params.email] The email address of the contact.
   * @param {string} [params.userId] The user ID of the contact.
   *
   * @see https://loops.so/docs/api-reference/delete-contact
   *
   * @returns {Object} Confirmation or error response (JSON)
   */
  async deleteContact({
    email,
    userId,
  }: {
    email?: string;
    userId?: string;
  }): Promise<DeleteSuccessResponse | ErrorResponse> {
    if (email && userId) throw "Only one parameter is permitted.";
    const payload: { email?: string; userId?: string } = {};
    if (email) payload["email"] = email;
    else if (userId) payload["userId"] = userId;
    else throw "You must provide an `email` or `userId` value.";
    return this._makeQuery({
      path: "v1/contacts/delete",
      method: "POST",
      payload,
    });
  }

  /**
   * Get mailing lists.
   *
   * @see https://loops.so/docs/api-reference/list-mailing-lists
   *
   * @returns {Object} List of mailing lists (JSON)
   */
  async getMailingLists(): Promise<Record<"id" | "name", string>[]> {
    return this._makeQuery({
      path: "v1/lists",
    });
  }

  /**
   * Send an event.
   *
   * @param {Object} params
   * @param {string} [params.email] The email address of the contact.
   * @param {string} [params.userId] The user ID of the contact.
   * @param {string} params.eventName The name of the event.
   * @param {Object} [params.contactProperties] Properties to update the contact with, including custom properties.
   * @param {Object} [params.eventProperties] Event properties, made available in emails triggered by the event.
   * @param {Object} [params.mailingLists] An object of mailing list IDs and boolean subscription statuses.
   *
   * @see https://loops.so/docs/api-reference/send-event
   *
   * @returns {Object} Response (JSON)
   */
  async sendEvent({
    email,
    userId,
    eventName,
    contactProperties,
    eventProperties,
    mailingLists,
  }: {
    email?: string;
    userId?: string;
    eventName: string;
    contactProperties?: ContactProperties;
    eventProperties?: EventProperties;
    mailingLists?: Record<string, boolean>;
  }): Promise<EventResponse> {
    if (!userId && !email)
      throw "You must provide an `email` or `userId` value.";
    const payload: {
      email?: string;
      userId?: string;
      eventName: string;
      eventProperties?: EventProperties;
      mailingLists?: Record<string, boolean>;
    } = {
      eventName,
      ...contactProperties,
      eventProperties,
      mailingLists,
    };
    if (email) payload["email"] = email;
    if (userId) payload["userId"] = userId;
    return this._makeQuery({
      path: "v1/events/send",
      method: "POST",
      payload,
    });
  }

  /**
   * Send a transactional email.
   *
   * @param {string} transactionalId The ID of the transactional email to send.
   * @param {string} email The email address of the recipient.
   * @param {Object} [dataVariables] Data variables as defined by the transational email template.
   *
   * @see https://loops.so/docs/api-reference/send-transactional-email
   *
   * @returns {Object} Confirmation or error response (JSON)
   */
  async sendTransactionalEmail(
    transactionalId: string,
    email: string,
    dataVariables?: TransactionalVariables,
    attachments?: Array<TransactionalAttachment>
  ): Promise<TransactionalResponse> {
    const payload: {
      transactionalId: string;
      email: string;
      dataVariables?: TransactionalVariables;
      attachments?: Array<TransactionalAttachment>;
    } = { transactionalId, email };
    if (dataVariables) payload["dataVariables"] = dataVariables;
    if (attachments) payload["attachments"] = attachments;
    return this._makeQuery({
      path: "v1/transactional",
      method: "POST",
      payload,
    });
  }

  /**
   * Get custom fields/properties.
   *
   * @see https://loops.so/docs/api-reference/list-custom-fields
   *
   * @returns {Object} List of custom fields (JSON)
   */
  async getCustomFields(): Promise<Record<"key" | "label" | "type", string>[]> {
    return this._makeQuery({
      path: "v1/contacts/customFields",
    });
  }
}

export { LoopsClient };