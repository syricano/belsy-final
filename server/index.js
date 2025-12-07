import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import sequelize from './db/index.js';
import errorHandler from './middleware/errorHandler.js';
import { routeMap } from './routes/index.js';
import applyAssociations from './db/associations.js';
import path from 'path';
import { fileURLToPath } from 'url';
import uploadRouter from './routes/uploadRouter.js';
import session from 'express-session';
import passport from 'passport';
import './config/passport.js';
import languageMiddleware from './middleware/language.js';



const app = express();
const PORT = process.env.PORT || 3000;

// === Middleware
app.use(cookieParser());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());

// social auth routes
app.use(session({
  secret: process.env.SESSION_SECRET || 'yourSecretKey',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  }
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(languageMiddleware);

// === Mount Routes
routeMap.forEach(({ path, handler }) => app.use(path, handler));

// === Serve Frontend in Production
if (process.env.NODE_ENV === 'production') {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const buildPath = path.join(__dirname, '../client/dist');

  app.use(express.static(buildPath));
  app.get('*splat', (req, res) => res.sendFile(path.join(buildPath, 'index.html')));
}

// === Basic Health Check
app.get('/', (req, res) => {
  res.send('Belsy API running...');
});

// === Error Handlers
app.use((req, res) => res.status(404).json({ error: 'Not found' }));
app.use(errorHandler);

// === Start Server
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
