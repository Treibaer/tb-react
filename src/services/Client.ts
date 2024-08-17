import Constants from "./Constants";

export default class Client {
  static shared = new Client();

  private api = `${Constants.backendUrl}/api/v3`;

  private getAuthToken() {
    return localStorage.getItem("token");
  }

  private async request<T>(url: string, options: RequestInit): Promise<T> {
    const response = await fetch(this.api + url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.getAuthToken()}`,
        ...options.headers,
      },
    });
    return this.handleResponse(response);
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Unauthorized");
      }
      const responseJson = await response.json();
      if (responseJson.error) {
        throw new Error(responseJson.error);
      }
      throw new Error("An error occurred");
    }
    return response.json();
  }

  async get<T>(url: string) {
    return this.request<T>(url, { method: "GET" });
  }

  async post(url: string, data: any): Promise<any> {
    return this.request(url, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async put(url: string, data: any): Promise<any> {
    return this.request(url, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async delete(url: string): Promise<any> {
    return this.request(url, {
      method: "DELETE",
    });
  }
}
