interface QueryOptions {
  path: `v1/${string}`;
  method?: "GET" | "POST" | "PUT";
  payload?: Record<string, string>;
  params?: Record<string, string>;
}

interface ContactResponse {
  success: boolean;
  id: string;
}

interface ErrorResponse {
  success: boolean;
  message: string;
}


export default class LoopsClient {

  apiKey: string
  apiRoot = 'https://app.loops.so/api/'

  constructor(apiKey: string) {
    this.apiKey = apiKey
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
  private async _makeQuery({ path, method = 'GET', payload, params }: QueryOptions) {
    const headers = new Headers()
    headers.set("Authorization", `Bearer ${this.apiKey}`)

    const url = new URL(path, this.apiRoot)
    if (params && method === "GET")
      Object.entries(params).forEach(([key, value]) =>
        url.searchParams.append(key, value)
      )

    try {
      const response = await fetch(url.href, {
        method,
        headers,
        body: payload ? JSON.stringify(payload) : undefined
      })
      return await response.json()
    } catch (error) {
      throw error
    }
  }

  /**
   * Create a new contact.
   * 
   * @param {string} email The email address of the contact.
   * @param {Object} [properties] All other contact properties, including custom properties.
   * 
   * @see https://loops.so/docs/add-users/api-reference#add
   * 
   * @returns {Object} Contact record or error response (JSON)
   */
  async createContact(email: string, properties?: Record<string, any>): Promise<ContactResponse | ErrorResponse> {
    const payload = { email, ...properties }
    return this._makeQuery({
      path: 'v1/contacts/create',
      method: 'POST',
      payload
    })
  }

  /**
   * Update a contact by email address.
   * 
   * @param {string} email The email address of the contact.
   * @param {Object} [properties] All other contact properties, including custom properties.
   * 
   * @see https://loops.so/docs/add-users/api-reference#update
   * 
   * @returns {Object} Contact record or error response (JSON)
   */
  async updateContact(email: string, properties?: Record<string, any>): Promise<ContactResponse | ErrorResponse> {
    const payload = { email, ...properties }
    return this._makeQuery({
      path: 'v1/contacts/update',
      method: 'PUT',
      payload
    })
  }

  /**
   * Find a contact by email address.
   * 
   * @param {string} email The email address of the contact.
   * 
   * @see https://loops.so/docs/add-users/api-reference#find
   * 
   * @returns {Object} List of contact records (JSON)
   */
  async findContact(email: string): Promise<Record<string, any>[]> {
    return this._makeQuery({
      path: 'v1/contacts/find',
      params: { email }
    })
  }

  /**
   * Delete a contact by email or user ID.
   * 
   * @param {Object} params
   * @param {string} [params.email] The email address of the contact.
   * @param {string} [params.userId] The user ID of the contact.
   * 
   * @see https://loops.so/docs/add-users/api-reference#delete
   * 
   * @returns {Object} Confirmation or error response (JSON)
   */
  async deleteContact({ email, userId }: { email?: string, userId?: string }): Promise<ErrorResponse> {
    const payload: {email?: string, userId?: string} = {}
    if (email) payload['email'] = email
    else if (userId) payload['userId'] = userId
    else throw 'You must provide an `email` or `userId` value.'
    return this._makeQuery({
      path: 'v1/contacts/delete',
      method: 'POST',
      payload
    })
  }

  /**
   * Send an event.
   * 
   * @param {string} email The email address of the contact.
   * @param {string} eventName The name of the event.
   * @param {Object} [properties] Properties to update the contact with, including custom properties.
   * 
   * @see https://loops.so/docs/add-users/api-reference#send
   * 
   * @returns {Object} Event record (JSON)
   */
  async sendEvent(email: string, eventName: string, properties?: Record<string, any>): Promise<Record<string, any>[]> {
    const payload = { email, eventName, ...properties }
    return this._makeQuery({
      path: 'v1/events/send',
      method: 'POST',
      payload
    })
  }
}