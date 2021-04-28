const mongoose = require("mongoose")
const CONNECTION_URL=process.env.REACT_APP_CONNECTION_URL;
async function mongoDBConnection() {
  try{
    const response=await mongoose.connect(CONNECTION_URL, {useNewUrlParser: true, useUnifiedTopology: true});
  }
  catch(err){
    console.log(err);
  }
}

module.exports={mongoDBConnection}