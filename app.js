const express = require('express')
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql')
const mongoose = require('mongoose');

const app = express();
const graphQlSchema = require('./graphql/schema/index')
const graphQlResolvers = require('./graphql/resolvers/index')

app.use(bodyParser.json());

app.use(
    '/graphql',
    graphqlHttp({
        schema: graphQlSchema,
        rootValue: graphQlResolvers
    }));

const options = {
    autoIndex: false,
    reconnectTries: 30,
    reconnectInterval: 500,
    poolSize: 10,
    bufferMaxEntries: 0
}
const connectWithRetry = () => {
    console.log('MongoDB connection with retry')
    mongoose.connect(`mongodb+srv://lfaitanin:faitanin123@cluster0-bauev.azure.mongodb.net/test?retryWrites=true&w=majority`, options).then(() => {
        console.log('MongoDB is connected')
        app.listen(3000);
    }).catch(err => {
        console.log('MongoDB connection unsuccessful, retry after 5 seconds.', err)
        setTimeout(connectWithRetry, 5000)
    })
}
connectWithRetry()
