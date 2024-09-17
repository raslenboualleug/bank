const express = require("express");
const cors = require("cors");
const PORT = 3000;
const app = express();

app.use(express.json());

app.use(cors());
const clientRoutes=require('./database/routes/clients/clientroutes')
app.use('/api', clientRoutes);


const userRoutes = require('./database/routes/user/userroutes');
app.use('/api', userRoutes);



const archiveRoutes = require('./database/routes/archive/archiveroutes');
// Use archive routes
app.use('/api/archives', archiveRoutes);






app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
