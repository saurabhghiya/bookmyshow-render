const mongoose = require('mongoose');

const mongo_url = process.env.mongo_url;

/* 
incase of errors while connecting replace the connect method with following
mongoose.connect(db,{
    useNewUrlParser : true,
    useUnifiedTopology : true,
})
*/
// process.env gives access to all .env files and variabls inside. 
// mongo_url is variable inside .env files
// dotenv package needs to be installed to use this feature

mongoose.connect(mongo_url).then(()=>{
    console.log('MongoDB Server Connection Established');
}).catch((error)=>{
    console.log(error);
})
