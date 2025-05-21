//express as a way to express a server
import express from 'express';
import cors from 'cors';
import MongooseSession from '@connections/mongoose.js';

import router_docs from '@features/documents/routes.js';
import router_users from '@features/user/routes.js';
import router_notes from '@features/notes/routes.js';

const database = "PruebaReact"
const port = 3000;
const app = express();

app.use(express.json());
app.use(cors());

app.listen(port, () => {
   console.log(`> 🔭 Listening at: [ http://localhost:${port} ] `);
});

await MongooseSession(database).catch(console.dir);

app.use('/user/', router_users);
app.use('/docs/', router_docs);
app.use('/notes/', router_notes);
