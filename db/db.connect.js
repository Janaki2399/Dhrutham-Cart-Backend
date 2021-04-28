const mongoose = require("mongoose")
const CONNECTION_URL=process.env.REACT_APP_CONNECTION_URL;
 function mongoDBConnection() {
  
  mongoose.connect("mongodb+srv://janaki2399:tinku456@janaki.k7yop.mongodb.net/inventory?retryWrites=true&w=majority", {useNewUrlParser: true, useUnifiedTopology: true})
  .then(()=>console.log("connected"))
  .catch((err)=>console.log(err))
  
}

module.exports={mongoDBConnection}