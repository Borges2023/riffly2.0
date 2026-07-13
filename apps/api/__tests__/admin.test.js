import request from "supertest";
import { app } from "../server.js";

describe("Admin API", () => {
  it("deve retornar erro ao tentar acessar usuários sem token", async () => {
    const response = await request(app).get("/api/admin/users");
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message");
  });
});
