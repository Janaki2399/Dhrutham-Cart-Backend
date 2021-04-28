const mongoose = require("mongoose")
// const CONNECTION_URL=process.env.REACT_APP_CONNECTION_URL;
 function mongoDBConnection() {
  
  mongoose.connect(process.env.CONNECTION_URL, {useNewUrlParser: true, useUnifiedTopology: true})
  .then(()=>console.log("connected"))
  .catch((err)=>console.log(err))
  
}

module.exports={mongoDBConnection}