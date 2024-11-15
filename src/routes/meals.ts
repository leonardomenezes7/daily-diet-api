import { FastifyInstance } from "fastify"
import { checkSessionIdExists } from "../middlewares/check-session-id-exists"
import { z } from "zod"
import { knex } from "../database"
import { randomUUID } from "node:crypto"

export async function mealsRoutes(app: FastifyInstance) {
  app.addHook("preHandler", checkSessionIdExists)

  app.post("/",async (request, reply) => {
    const createMealBodySchema = z.object({
      name: z.string(),
      description: z.string(),
      is_on_diet: z.boolean(),
      date: z.coerce.date()
    })

    const { name, description, is_on_diet, date } = createMealBodySchema.parse(
      request.body
    )

    await knex("meals").insert({
      id: randomUUID(),
      name,
      description,
      is_on_diet,
      date,
      user_id: request.user?.id
    })

    return reply.status(201).send()
  })

  app.get("/", async (request, reply) => {
    const meals = await knex("meals")
      .where({ user_id: request.user?.id })
      .orderBy("created_at", "desc")

    return reply.send({ meals })
  })

  app.get("/:mealId", async (request, reply) => {
    const paramsSchema = z.object({
      mealId: z.string().uuid()
    })

    const { mealId } = paramsSchema.parse(request.params)

    const meal = await knex("meals").where({ id: mealId }).first()

    if (!meal) {
      return reply.status(404).send({ error: "Meal not found." })
    }

    return reply.send({ meal })
  })

  app.put("/:mealId", async (request, reply) => {
    const paramsSchema = z.object({
      mealId: z.string().uuid()
    })

    const { mealId } = paramsSchema.parse(request.params)

    const updateMealBodySchema = z.object({
      name: z.string(),
      description: z.string(),
      is_on_diet: z.boolean(),
      date: z.coerce.date()
    })

    const { name, description, is_on_diet, date } = updateMealBodySchema.parse(
      request.body
    )

    const meal = await knex("meals").where({ id: mealId }).first()

    if (!meal) {
      return reply.status(404).send({ error: "Meal not found." })
    }

    await knex("meals").where({ id: mealId }).update({
      name,
      description,
      is_on_diet,
      date
    })

    return reply.status(204).send()
  })

  app.delete("/:mealId", async (request, reply) => {
    const paramsSchema = z.object({
      mealId: z.string().uuid()
    })

    const { mealId } = paramsSchema.parse(request.params)

    const meal = await knex("meals").where({ id: mealId }).first()

    if (!meal) {
      return reply.status(404).send({ error: "Meal not found." })
    }

    await knex("meals").where({ id: mealId }).delete()

    return reply.status(204).send()
  })

  app.get("/metrics", async (request, reply) => {
    const totalMeals = await knex("meals")
      .where({ user_id: request.user?.id })
      .orderBy("date", "desc")

    const totalMealsOnDiet = await knex("meals")
      .where({ user_id: request.user?.id, is_on_diet: true })
      .count("id", { as: "total" })
      .first()

    const totalMealsOffDiet = await knex("meals")
      .where({ user_id: request.user?.id, is_on_diet: false })
      .count("id", { as: "total" })
      .first()

    const { bestOnDietSequence } = totalMeals.reduce(
      (acc, meal) => {
        if (meal.is_on_diet) {
          acc.currentSequence += 1
        } else {
          acc.currentSequence = 0
        }

        if (acc.currentSequence > acc.bestOnDietSequence) {
          acc.bestOnDietSequence = acc.currentSequence
        }
        
        return acc
      },
      { bestOnDietSequence: 0, currentSequence: 0 }
    )

    return reply.send({
      totalMeals: totalMeals.length,
      totalMealsOnDiet: totalMealsOnDiet?.total,
      totalMealsOffDiet: totalMealsOffDiet?.total,
      bestOnDietSequence
    })
  })
}