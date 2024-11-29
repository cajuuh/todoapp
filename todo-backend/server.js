const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/todoapp";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect(); // Creates db connection
    console.log("Connected successfully to MongoDB");

    const db = client.db("todoapp");
    const todosCollection = db.collection("todos");

    app.get("/api/todos", async (req, res) => {
      try {
        const todos = await todosCollection.find({}).toArray();
        res.json(todos);
      } catch (error) {
        console.error("Error fetching todos:", error);
        res.status(500).json({ message: "Error fetching todos" });
      }
    });

    // POST endpoint to create a new todo
    app.post("/api/todos", async (req, res) => {
      try {
        const { text } = req.body;
        const newTodo = { text, isDone: false };
        const result = await todosCollection.insertOne(newTodo);
        res.status(201).json({ _id: result.insertedId, ...newTodo });
      } catch (error) {
        console.error("Error creating todo:", error);
        res.status(500).json({ message: "Error creating todo" });
      }
    });

    app.put("/api/todos/:id", async (req, res) => {
      try {
        const { id } = req.params;
        const { isDone } = req.body;
        const result = await todosCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: { isDone } }
        );
        if (result.matchedCount === 0) {
          return res.status(404).json({ message: "Todo not found" });
        }
        res.json({ message: "Todo updated successfully" });
      } catch (error) {
        console.error("Error updating todo:", error);
        res.status(500).json({ message: "Error updating todo" });
      }
    });

    app.delete("/api/todos/completed", async (req, res) => {
      try {
        console.log("Attempting to delete completed todos");
        const result = await todosCollection.deleteMany({ isDone: true });
        console.log("Delete operation result:", result);
        if (result.acknowledged) {
          res.json({
            message: `${result.deletedCount} completed todos deleted successfully`,
          });
        } else {
          throw new Error("Delete operation not acknowledged");
        }
      } catch (error) {
        console.error("Error deleting completed todos:", error);
        res.status(500).json({
          message: "Error deleting completed todos",
          error: error.message,
        });
      }
    });

    app.delete("/api/todos/:id", async (req, res) => {
      try {
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
          return res.status(400).json({ message: "Invalid todo ID format" });
        }

        const result = await todosCollection.deleteOne({
          _id: new ObjectId(id),
        });
        if (result.deletedCount === 0) {
          return res.status(404).json({ message: "Todo not found" });
        }
        res.json({ message: "Todo deleted successfully" });
      } catch (error) {
        console.error("Error deleting todo:", error);
        res.status(500).json({ message: "Error deleting todo" });
      }
    });

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Database connection error:", error);
  }
}

run().catch(console.dir);

// Handle server shutdown
process.on("SIGINT", async () => {
  await client.close();
  console.log("MongoDB connection closed");
  process.exit(0);
});
