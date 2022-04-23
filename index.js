//1basic
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
//3
const app = express()
const port = process.env.PORT || 5000

require('dotenv').config()

//4middleware
app.use(cors())
app.use(express.json())


//5 mongodb

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ntqc6.mongodb.net/myFirstDatabase?retryWrites=true&w=majorit`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

//6
// https://www.mongodb.com/docs/drivers/node/current/usage-examples/find/ 
async function run() {
    try {
        //7
        await client.connect();
        const foodCollection = client.db("mealdb").collection("food");

        //8CRUD ==> R [get means load data] findMultiple
        app.get('/food', async (req, res) => {
            const query = {}
            const cursor = foodCollection.find(query)
            const foods = await cursor.toArray()
            res.send(foods)
        })
        //9 find one 
        app.get('/food/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const food = await foodCollection.findOne(query)
            res.send(food)
        })

        //10 post insertOne
        app.post('/food', async (req, res) => {
            const food = req.body
            const result = await foodCollection.insertOne(food)
            res.send(result)
        })

        //11 delete 
        app.get('/food/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await foodCollection.deleteOne(query)
            res.send(result)
        })

        //12 update 
        app.put('/food/:id', async (req, res) => {
            const id = req.params.id
            const updateUser = req.body
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true };
            // create a document that sets the plot of the food
            const updateDoc = {
                $set: {
                    name : updateUser.name , 
                    title : updateUser.title,
                    img : updateUser.img ,
                    price : updateUser.price
                },
            };
            const result = await foodCollection.updateOne(filter, updateDoc, options);
            console.log(result);
        })


    } finally {
        //   await client.close();
    }
}
run().catch(console.dir);

//2test

app.get('/', (req, res) => {
    res.send('Mealdb Server Working')
})

app.listen(port, () => {
    console.log("Running Mealdb on", port);
})