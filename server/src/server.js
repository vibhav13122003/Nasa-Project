const http = require('http');

const app = require('./app');

const { loadPlanetsData } = require('./models/planets.model');

const PORT = process.env.PORT || 8000;
const mongoose = require('mongoose')
const server = http.createServer(app);
const Mongo_Url = 'mongodb+srv://vibhavbhartiya:1drV3yjdMRmSaKWx@cluster0.ewedxjx.mongodb.net/?retryWrites=true&w=majority'

mongoose.connection.once('open', () => {
    console.log("MongoDb connection open")
})
mongoose.connection.on('error', (err) => {
    console.log(err)
})
async function startServer() {
    await mongoose.connect(Mongo_Url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,

    })
    await loadPlanetsData();
    
    server.listen(PORT, () => {
        console.log(`Listening on port ${PORT}...`);
    });
}

startServer();