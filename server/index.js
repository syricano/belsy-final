import express from 'express';
import cookieParser from 'cookie-parser';
import sequelize from './db/index.js';
import errorHandler from './middleware/errorHandler.js';
import adminRouter from './routes/adminRouter.js';
import authRouter from './routes/authRouter.js';
import dutyRouter from './routes/dutyRouter.js';
import cors from 'cors';
const app = express();
const PORT = process.env.PORT || 3000;
import path from 'path';
import { fileURLToPath } from 'url';
import applyAssociations from './db/associations.js';
import reservationRouter from './routes/reservationRouter.js';
app.use(cookieParser());



app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use('/api/auth', authRouter);
app.use('/api/admin', adminRouter);
app.use('/api/reservations', reservationRouter);
app.use('/api/duty', dutyRouter);


if (process.env.NODE_ENV === 'production') {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  //*Set static folder up in production
  const buildPath = path.join(__dirname, '../client/dist');
  app.use(express.static(buildPath));

  app.get('*splat', (req, res) => res.sendFile(path.join(buildPath, 'index.html')));
}

app.get('/', (req, res) => {
  res.send('Belsy API running...');
});


// THIS SHOULD BE BEFORE THE ERROR HANDLERs
app.use((req, res) => res.status(404).json({ error: 'Not found' }));
app.use(errorHandler);

const start = async () => {
  try {
    applyAssociations(); 
    await sequelize.sync({ alter: true });
    app.listen(PORT, () => {
      console.log(`✅ Server is running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Error starting server:', err);
  }
};

start();
export default app;