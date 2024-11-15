import { afterAll, beforeAll, beforeEach, describe, it } from "vitest"
import request from "supertest"
import { app } from "../src/app"
import { execSync } from "node:child_process"

describe("meals routes", () => {
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

  it("should be able to create a new meal", async () => {
    const createUserResponse = await request(app.server)
      .post("/users")
      .send({
        name: "Leonardo",
        email: "leonardo@email.com"
      })

    const cookies = createUserResponse.get("Set-Cookie")

    if (!cookies) {
      throw new Error("Unauthorized")
    }

    await request(app.server)
      .post("/meals")
      .set("Cookie", cookies)
      .send({
        name: "Janta",
        description: "Pizza",
        is_on_diet: false,
        date: "11/11/2014"
      })
      .expect(201)
  })

  it("should be able to list all meals from a user", async () => {
    const createUserResponse = await request(app.server)
      .post("/users")
      .send({
        name: "Leonardo",
        email: "leonardo@email.com"
      })

    const cookies = createUserResponse.get("Set-Cookie")

    if (!cookies) {
      throw new Error("Unauthorized")
    }

    await request(app.server)
      .post("/meals")
      .set("Cookie", cookies)
      .send({
        name: "Janta",
        description: "Pizza",
        is_on_diet: false,
        date: "11/11/2014"
      })

    await request(app.server)
      .get("/meals")
      .set("Cookie", cookies)
      .expect(200)
  })

  it("should be able to get a single meal", async () => {
    const createUserResponse = await request(app.server)
      .post("/users")
      .send({
        name: "Leonardo",
        email: "leonardo@email.com"
      })

    const cookies = createUserResponse.get("Set-Cookie")

    if (!cookies) {
      throw new Error("Unauthorized")
    }

    await request(app.server)
      .post("/meals")
      .set("Cookie", cookies)
      .send({
        name: "Janta",
        description: "Pizza",
        is_on_diet: false,
        date: "11/11/2014"
      })

    const getAllMealsResponse = await request(app.server)
      .get("/meals")
      .set("Cookie", cookies)
    
    const mealId = getAllMealsResponse.body.meals[0].id

    await request(app.server)
      .get(`/meals/${mealId}`)
      .set("Cookie", cookies)
      .expect(200)
  })

  it("should be able to update a meal from a user", async () => {
    const createUserResponse = await request(app.server)
      .post("/users")
      .send({
        name: "Leonardo",
        email: "leonardo@email.com"
      })

    const cookies = createUserResponse.get("Set-Cookie")

    if (!cookies) {
      throw new Error("Unauthorized")
    }

    await request(app.server)
      .post("/meals")
      .set("Cookie", cookies)
      .send({
        name: "Janta",
        description: "Pizza",
        is_on_diet: false,
        date: "11/11/2014"
      })

    const getAllMealsResponse = await request(app.server)
      .get("/meals")
      .set("Cookie", cookies)
    
    const mealId = getAllMealsResponse.body.meals[0].id

    await request(app.server)
      .put(`/meals/${mealId}`)
      .set("Cookie", cookies)
      .send({
        name: "Janta",
        description: "Salada",
        is_on_diet: true,
        date: "11/11/2014"
      })
      .expect(204)
  })

  it("should be able to delete a meal from a user", async () => {
    const createUserResponse = await request(app.server)
      .post("/users")
      .send({
        name: "Leonardo",
        email: "leonardo@email.com"
      })

    const cookies = createUserResponse.get("Set-Cookie")

    if (!cookies) {
      throw new Error("Unauthorized")
    }

    await request(app.server)
      .post("/meals")
      .set("Cookie", cookies)
      .send({
        name: "Janta",
        description: "Pizza",
        is_on_diet: false,
        date: "11/11/2014"
      })

    const getAllMealsResponse = await request(app.server)
      .get("/meals")
      .set("Cookie", cookies)
    
    const mealId = getAllMealsResponse.body.meals[0].id

    await request(app.server)
      .delete(`/meals/${mealId}`)
      .set("Cookie", cookies)
      .expect(204)
  })

  it("should be able to get metrics from a user", async () => {
    const createUserResponse = await request(app.server)
      .post("/users")
      .send({
        name: "Leonardo",
        email: "leonardo@email.com"
      })

    const cookies = createUserResponse.get("Set-Cookie")

    if (!cookies) {
      throw new Error("Unauthorized")
    }

    await request(app.server)
      .post("/meals")
      .set("Cookie", cookies)
      .send({
        name: "Janta",
        description: "Pizza",
        is_on_diet: true,
        date: "11/11/2014"
      })

    await request(app.server)
      .post("/meals")
      .set("Cookie", cookies)
      .send({
        name: "Janta",
        description: "Pizza",
        is_on_diet: true,
        date: "11/11/2014"
      })

    await request(app.server)
      .post("/meals")
      .set("Cookie", cookies)
      .send({
        name: "Janta",
        description: "Pizza",
        is_on_diet: true,
        date: "11/11/2014"
      })

    await request(app.server)
      .post("/meals")
      .set("Cookie", cookies)
      .send({
        name: "Janta",
        description: "Pizza",
        is_on_diet: false,
        date: "11/11/2014"
      })

    const metricsResponse = await request(app.server)
      .get("/meals/metrics")
      .set("Cookie", cookies)
      .expect(200)
  })
})