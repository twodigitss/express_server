//express as a way to express a server
import express from 'express';
import cors from 'cors';
import MongooseSession from './connections/mongoose.js';

import router_docs from './routes/routes_docs.js';
import router_users from './routes/routes_users.js';

const port = 3000;
const app = express();
app.use(express.json());
app.use(cors());

app.listen(port, () => {
   console.log(`🍀 Listening at: [ http://localhost:${port} ]`);
});

await MongooseSession().catch(console.dir);

app.use('/', router_users);
app.use('/', router_docs);
