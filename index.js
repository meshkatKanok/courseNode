const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.port || 5000;
require('dotenv').config()
app.use(cors())
app.use(express.json())




app.get('/', (req, res) => {
    res.send("ndl server running")
})
const uri = `mongodb+srv://${process.env.Nedl_user}:${process.env.Nedl_pass}@cluster0.khjyu2b.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        const nedlData = client.db('coursedata').collection("courses")
        const UserData = client.db('coursedata').collection("UserData")
        const UserPicture = client.db('coursedata').collection("UserPicture")
        const AlbumPicture = client.db('coursedata').collection("AlbumPicture")
        const AdmissionData = client.db('coursedata').collection("AdmissionData")
        const BlogData = client.db('coursedata').collection("Blog")
        const productData = client.db('coursedata').collection("product")

        // all course
        app.get('/course', async (req, res) => {
            const search = req.query.search
            if (search) {

                const query = {
                    $text: {
                        $search: search
                    }
                }
                console.log(query);
                const cursor = nedlData.find(query).sort("_id")
                const courses = await cursor.toArray()
                console.log(courses);
                res.send(courses)
            }
            else {
                const query = {}
                const cursor = nedlData.find(query).sort("_id")
                const courses = await cursor.toArray()
                res.send(courses)
            }


        })
        // Product Data------------------
        app.get("/product",async(req,res)=>{
            const query={}
            const cursor=productData.find(query)
            const product=await cursor.toArray()
            res.send(product)
        })
        // Product Data Post---------
        app.post('/product', async (req, res) => {
            const post = req.body
            const Addproduct = await productData.insertOne(post)
            res.send(Addproduct)
        })
        // Galary photo
        app.get('/photo', async (req, res) => {
            const query = {}
            const cursor = AlbumPicture.find(query)
            const photo = await cursor.toArray()
            res.send(photo)

        })
        // Galary photo
        app.delete('/photo/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const photoadd = await AlbumPicture.deleteOne(query)
            res.send(photoadd)

        })
        // Galary photo
        app.post('/photo', async (req, res) => {
            const post = req.body
            const AddPhoto = await AlbumPicture.insertOne(post)
            res.send(AddPhoto)
        })
        // all course
        app.post('/course', async (req, res) => {
            const post = req.body
            const CoursePost = await nedlData.insertOne(post)
            res.send(CoursePost)
        })
        // all course
        app.delete('/course/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const dresult = await nedlData.deleteOne(query)
            res.send(dresult)
        })
        // all course
        app.get('/course/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const coursedetais = await nedlData.findOne(query)
            res.send(coursedetais)
        })
        // User Data
        app.post('/Userdata', async (req, res) => {
            const post = req.body
            const Userpost = await UserData.insertOne(post)
            res.send(Userpost)
        })
        // User Data
        app.get("/Userdata", async (req, res) => {
            const query = {}
            const cursor = UserData.find(query)
            const userData = await cursor.toArray()
            res.send(userData)
        })
        // User picture
        app.post('/UserPicture', async (req, res) => {
            const post = req.body
            const UserPic = await UserPicture.insertOne(post)
            res.send(UserPic)
        })
        // User picture
        app.get('/UserPicture', async (req, res) => {
            const query = {}
            const cursor = UserPicture.find(query)
            const userpicData = await cursor.toArray()
            res.send(userpicData)
        })
        // Admin pannel
        app.get('/user/admin/:email', async (req, res) => {
            const email = req.params.email
            const query = { email: email }
            const user = await UserData.findOne(query)
            res.send({ isAdmin: user?.selectoption === 'Admin' })
        })
        // Admin course update
        app.put('/course/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const updatedData = req.body;
            const updateDoc = { $set: updatedData }
            const result = await nedlData.updateOne(query, updateDoc)
            res.send(result)
        })
        // User Picture Update
        app.put('/UserPicture/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const updateUdsrpic = req.body
            const updateDoc = { $set: updateUdsrpic }
            const result = await UserPicture.updateOne(query, updateDoc)
            res.send(result)
        })
        // Admission post Data
        app.post('/admissiondata', async (req, res) => {
            const post = req.body
            const admissiondata = await AdmissionData.insertOne(post)
            res.send(admissiondata)
        })
        // Admission get data

        app.get('/admission', async (req, res) => {
            const query = {}
            const cursor = AdmissionData.find(query)
            const alladmissiondata = await cursor.toArray()
            console.log(alladmissiondata);
            res.send(alladmissiondata)
        })
        // Blog Post----

        app.post('/blogData', async (req, res) => {
            const post = req.body
            const adblog = await BlogData.insertOne(post)
            res.send(adblog)
        })

        // Get Blog Data--
        app.get('/blogData', async (req, res) => {
            const query = {}
            const cursor = BlogData.find(query)
            const allBogdata = await cursor.toArray()
            res.send(allBogdata)
        })
        // delete Blog Data--------

        app.delete('/blogData/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const blogdelete = await BlogData.deleteOne(query)
            res.send(blogdelete)
        })

    }
    finally {

    }
}


run().catch(console.dir)


app.listen(port, () => {
    console.log(`ndl server port ${port}`);
})