const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require("mongodb");
const { ObjectID } = require("bson");

require("dotenv").config();

//middle wares
app.use(cors());
app.use(express.json());

//bdcarrentuser
//nou16AMzuke0Rbew

const uri = "mongodb+srv://bdcarrentuser:nou16AMzuke0Rbew@cluster0.9lwp0ni.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        const serviceCollection = client.db("carrent").collection("services");
        const reviewCollection = client.db("carrent").collection("reviews");

        app.get("/services", async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        });
        app.get("/threeServices", async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.limit(3).toArray();
            res.send(services);
        });

        app.get("/services/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectID(id) };
            const service = await serviceCollection.findOne(query);
            res.send(service);
        });

        //review api
        app.get("/reviews", async (req, res) => {
            let query = {};
            if (req.query.email) {
                query = {
                    email: req.query.email,
                };
            }
            const cursor = reviewCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews);
        });
        app.post("/reviews", async (req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.send(result);
        });
        app.patch("/reviews/:id", async (req, res) => {
            const id = req.params.id;
            const status = req.body.status;
            const query = { _id: ObjectID(id) };
            const updatedDoc = {
                $set: {
                    status: status,
                },
            };
            const result = await reviewCollection.updateOne(query, updatedDoc);
            res.send(result);
        });
        app.delete("/reviews/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectID(id) };
            const results = await reviewCollection.deleteOne(query);
            res.send(results);
        });
    } finally {
    }
}
run().catch((err) => console.error(err));

app.get("/", (req, res) => {
    res.send("genious car sarver is running");
});

app.listen(port, () => {
    console.log(`Car rental API running ${port}`);
});
