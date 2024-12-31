const mongooseVar = require('mongoose');

const dbconn = async ()=>{
    try{
        await mongooseVar.connect(process.env.MONGO_URL);
        console.log(`connected to mongodb  ${mongooseVar.connection.host}`);

    }
    catch(error){
        console.log(`Mongo db error: ${error}`);
    }
    
}

module.exports = {
    dbconn,
}