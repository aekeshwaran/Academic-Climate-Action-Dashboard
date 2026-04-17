import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { initDB } from './db.js';
import routes from './routes/index.js';

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Initialize DB then start server
initDB().catch(err => console.error(err));

app.use('/api', routes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
