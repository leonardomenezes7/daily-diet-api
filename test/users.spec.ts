import { execSync } from "node:child_process"
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest"
import request from "supertest"
import { app } from "../src/app"

describe("users routes", () => {
  beforeAll(async () => {
    await app.ready()
  })
  
  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    execSync("npm run knex migrate:rollback --all")
    execSync("npm run knex migrate:latest")
  })
  
  it("should be able to create a user", async () => {
    const response = await request(app.server)
      .post("/users")
      .send({
        name: "João",
        email: "joao@email.com"
      })
      .expect(201)

    const cookies = response.get("Set-Cookie")

    expect(cookies).toEqual(
      expect.arrayContaining([expect.stringContaining("sessionId")])
    )
  })
})

