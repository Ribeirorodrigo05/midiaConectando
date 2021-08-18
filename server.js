const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
//requerendo módulo
const users = require('./routes/api/users')
const profile = require('./routes/api/profile')
const posts = require('./routes/api/posts')

const app = express();


app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

const mongoConnection = require('./config/keys').dbURL;


// conexão mongodb
mongoose.connect(mongoConnection, {useNewUrlParser: true, useUnifiedTopology: true })
.then(()=> console.log('Mongo is connected'))
.catch((err)=> console.log(err))


//middleware passport
app.use(passport.initialize());

//Passport config
require('./config/passport.js')(passport);

//rotas
app.use('/api/users', users)
app.use('/api/profile', profile)
app.use('/api/posts', posts)

//subindo o server
const PORT  = process.env.PORT || 6000;
app.listen(PORT,()=> console.log('Server is online'))



/*app.use(express.urlencoded({extended: true}));
app.use(express.json());*/