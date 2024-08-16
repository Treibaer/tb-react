import Constants from "./Constants";

export default class Client {
  static shared = new Client();

  private api = `${Constants.backendUrl}/api/v3`;

  private getAuthToken() {
    return localStorage.getItem("token");
  }

  async get(url: string) {
    const response = await fetch(this.api + url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.getAuthToken()}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Unauthorized");
      }
      const responseJson = await response.json();
      if (responseJson.error) {
        throw new Error(responseJson.error);
      }
      throw new Error("Error creating deck");
    }
    return await response.json();
  }

  async post(url: string, data: string) {
    const response = await fetch(this.api + url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.getAuthToken()}`,
      },
      body: data,
    });

    if (!response.ok) {
      const responseJson = await response.json();
      if (responseJson.error) {
        throw new Error(responseJson.error);
      }
      throw new Error("Error creating deck");
    }
    return await response.json();
  }

  async put(url: string, data: string) {
    const response = await fetch(this.api + url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${this.getAuthToken()}`,
      },
      body: data,
    });

    if (!response.ok) {
      const responseJson = await response.json();
      if (responseJson.error) {
        throw new Error(responseJson.error);
      }
      throw new Error("Error creating deck");
    }
    return await response.json();
  }

  async delete(url: string) {
    const response = await fetch(this.api + url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${this.getAuthToken()}`,
      },
    });

    if (!response.ok) {
      const responseJson = await response.json();
      if (responseJson.error) {
        throw new Error(responseJson.error);
      }
      throw new Error("Error creating deck");
    }
    return await response.json();
  }
}
