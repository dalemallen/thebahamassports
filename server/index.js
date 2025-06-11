import express from 'express';
import rolesRouter from './routes/roles.js'; // adjust path if needed

const app = express();
app.use(express.json());

app.use('/api', rolesRouter);

app.listen(3000, () => console.log('Server running on port 3000'));
