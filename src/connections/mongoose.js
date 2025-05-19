//=============================================================
// MONGOOSE MONGOOSE MONGOOSE MONGOOSE MONGOOSE MONGOOSE
//=============================================================

import mongoose from 'mongoose';
const { MONGO_URL: uri } = process.env;

async function MongooseSession() {
  try {
    await mongoose.connect(uri);
    const db_name = mongoose.connection.name
    console.log("🌱 [MDB] Connected to:", db_name );
    return mongoose.connection;
  } catch (err) {
    console.error("🚫 [MDB] Conection error:", err);
    return err;
  } 
}

export default MongooseSession;

