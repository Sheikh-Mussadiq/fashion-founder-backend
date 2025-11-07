// src/index.js
const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const routes = require('./routes');

dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use('/', routes);

const FEED_ID = '_81MY6y0i60xEIfZr';
const AUTH_TOKEN = 'Bearer c_tGXztJJbzAbmVW:s_G1xJPQAH4hkBslhUatSSfz';


app.get('/rss-feed', async (req, res) => {
  try {
    const response = await fetch(`https://api.rss.app/v1/bundles/${FEED_ID}`, {
      method: 'GET',
      headers: {
        'Authorization': AUTH_TOKEN
      }
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: `Failed to fetch feed. Status: ${response.status}` });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
