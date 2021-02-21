const cors = require('cors');
const express = require('express');
const { setup } = require('./deploy');
const bodyParser = require('body-parser');
const {graphqlHTTP} = require('express-graphql')
const { schema } = require("./apis")

const app = express();
app.use(bodyParser.json())
app.use(cors())

app.use('/graphql',graphqlHTTP({
   schema,
   graphiql: true
}))

app.get('/*', function(req, res){
   res.send("<h1>Main Page</h1>");
});


app.listen(setup.port, setup.host);
