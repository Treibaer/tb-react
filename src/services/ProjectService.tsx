export default class ProjectService {
  private api = "http://localhost:3052/api";

  static shared = new ProjectService();
  private constructor() {}

  async createProject(title: string) {
    const response = await fetch(`${this.api}/projects`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title }),
    });
    return await response.json();
  }


  async loadProjects() {
    const response = await fetch(`${this.api}/projects`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await response.json();
  }

  async loadTickets(projectId: number) {
    const response = await fetch(`${this.api}/projects/${projectId}/tickets`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await response.json();
  }
}
