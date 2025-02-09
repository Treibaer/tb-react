import Constants from "./Constants";

/**
 * Service class for making HTTP requests to the backend API.
 * Provides methods for GET, POST, PATCH, PUT, DELETE requests, and file uploads.
 */
export default class Client {
  static shared = new Client();
  private api = `${Constants.backendUrl}/api/v3`;

  /**
   * Makes a GET request to the specified URL.
   * @param url - The endpoint URL (relative to the API base).
   * @returns A promise that resolves to the response data.
   */
  async get<T>(url: string): Promise<T> {
    return this.request<T>(url, { method: "GET" });
  }

  /**
   * Makes a POST request to the specified URL with the given data.
   * @param url - The endpoint URL (relative to the API base).
   * @param data - The data to send in the request body.
   * @returns A promise that resolves to the response data.
   */
  async post<T>(url: string, data: any): Promise<T> {
    return this.request<T>(url, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  /**
   * Uploads a file to the specified URL.
   * @param url - The endpoint URL (relative to the API base).
   * @param data - The FormData object containing the file and other data.
   * @returns A promise that resolves to the response data.
   */
  async uploadFile<T>(url: string, data: FormData): Promise<T> {
    const response = await fetch(this.api + url, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${this.getAuthToken()}`,
      },
      method: "POST",
      body: data,
    });
    return this.handleResponse(response);
  }

  /**
   * Makes a PATCH request to the specified URL with the given data.
   * @param url - The endpoint URL (relative to the API base).
   * @param data - The data to send in the request body.
   * @returns A promise that resolves to the response data.
   */
  async patch<T>(url: string, data: any) {
    return this.request<T>(url, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  /**
   * Makes a PUT request to the specified URL with the given data.
   * @param url - The endpoint URL (relative to the API base).
   * @param data - The data to send in the request body.
   * @returns A promise that resolves to the response data.
   */
  async put(url: string, data: any): Promise<any> {
    return this.request(url, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  /**
   * Makes a DELETE request to the specified URL.
   * @param url - The endpoint URL (relative to the API base).
   * @returns A promise that resolves to the response data.
   */

  async delete(url: string): Promise<any> {
    return this.request(url, { method: "DELETE" });
  }

  /**
   * Retrieves the authorization token from local storage.
   * @returns The authentication token string.
   */
  private getAuthToken(): string | null {
    return localStorage.getItem("token");
  }

  /**
   * Makes an HTTP request using the Fetch API.
   * @param url - The endpoint URL (relative to the API base).
   * @param options - The options for the Fetch request, including method and body.
   * @returns A promise that resolves to the response data.
   */
  private async request<T>(url: string, options: RequestInit): Promise<T> {
    const response = await fetch(this.api + url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${this.getAuthToken()}`,
        ...options.headers,
      },
    });
    return this.handleResponse(response);
  }

  /**
   * Handles the HTTP response, checking for errors and parsing the JSON body.
   * @param response - The response object from the Fetch API.
   * @returns A promise that resolves to the parsed JSON response data.
   */
  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        const error: any = new Error("Unauthorized");
        error.status = response.status;
        throw error;
      }
      if (response.status === 404) {
        const error: any = new Error("Not found");
        error.status = response.status;
        throw error;
      }
      const responseJson = await response.json();
      if (responseJson.message) {
        throw new Error(responseJson.message);
      }
      throw new Error("An error occurred");
    }
    return response.json();
  }
}
