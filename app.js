const express = require('express');
// const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const mongoose = require('mongoose');

const graphQlSchema = require('./graphql/schema/index')
const graphQlResolvers = require('./graphql/resolvers/index')
const isAuth = require('./middleware/is-auth')

const app = express();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Origin', 'POST,GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Origin', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
})

app.use(isAuth)

// app.use(bodyParser.json());

app.use(
    '/api', graphqlHTTP({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
    graphiql: true
}))

mongoose.connect( `mongodb://localhost:27017/${process.env.MONGO_DB}`).then(() => {
    app.listen(3001);
}).catch(err => {
    console.log(err)
})
