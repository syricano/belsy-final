import express from 'express';
import sequelize from './db/index.js';
import User from './models/User.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());



app.get('/', (req, res) => {
  res.send('Belsy API running...');
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
export default app;