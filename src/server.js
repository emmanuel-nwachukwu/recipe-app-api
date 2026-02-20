import express from "express";
import { ENV } from "./config/env.js";
import { db } from "./config/db.js";
import { favouritesTable } from "./db/schema.js";

const app = express();
const PORT = ENV.PORT;

app.use(express.json()); // needed to get value from req body else undefined

app.listen(PORT, () => {
  console.log("Server is running on port: ", PORT);
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    // success: true,
    responseCode: 200,
    responseMessage: "Server is healthy",
    data: null,
  });
});

app.get("/api/favourites/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const userFavourites = await db
      .select()
      .from(favouritesTable)
      .where(eq(favouritesTable.userId.userId, userId));

    return res.status(200).json({
      responseCode: 200,
      responseMessage: "Internal server error",
      data: userFavourites,
    });
  } catch (error) {
    console.error("Error fetching favourite: ", error);
    return res.status(500).json({
      responseCode: 500,
      responseMessage: "Internal server error",
      data: null,
    });
  }
});

app.delete("/api/favourites/:userId/:recipeId", async (req, res) => {
  try {
    const { userId, recipeId } = req.params;
    await db
      .delete(favouritesTable)
      .where(
        and(
          eq(favouritesTable.userId, userId),
          eq(favouritesTable.recipeId, parseInt(recipeId))
        )
      );

    res.status(200).json({
      responseCode: 200,
      responseMessage: "Favourites removed successfully",
      data: null,
    });
  } catch (error) {
    console.error("Error removing favourite: ", error);
    return res.status(500).json({
      responseCode: 500,
      responseMessage: "Internal server error",
      data: null,
    });
  }
});

app.post("/api/favourites", async (req, res) => {
  try {
    const { userId, recipeId, title, image, cookTime, servings } = req.body;
    console.log(req.body);

    if (!userId || !recipeId || !title) {
      return res.status(400).json({
        responseCode: 400,
        responseMessage: "Missing required fields",
        data: null,
      });
    }

    const newFavourite = await db
      .insert(favouritesTable)
      .values({
        userId,
        recipeId,
        title,
        image,
        cookTime,
        servings,
      })
      .returning();

    return res.status(201).json({
      responseCode: 201,
      responseMessage: "Successfully added to favourites",
      data: newFavourite[0],
    });
  } catch (error) {
    console.error("Error adding favourite: ", error);
    return res.status(500).json({
      responseCode: 500,
      responseMessage: "Internal server error",
      data: null,
    });
  }
});
