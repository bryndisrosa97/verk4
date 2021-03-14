import express from 'express';
import fetch from 'node-fetch';

import { timerStart, timerEnd } from './time.js';
import { getter, setter } from './cache.js';

export const proxyRouter = express.Router();

proxyRouter.get('/proxy', async (req, res) => {
  const { type, period } = req.query;
  const URL = `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/${type}_${period}.geojson`;
  let result;

  const timer = timerStart();
  try {
    result = await getter(`${type}_${period}`);
  } catch (e) {
    console.error('error getting from cache', e);
  }

  if (result) {
    const data = {
      data: JSON.parse(result),
      info: {
        cached: true,
        time: timerEnd(timer),
      },
    };
    res.json(data);
    return;
  }
  try {
    result = await fetch(URL);
  } catch (e) {
    console.error('Error fetching data from server');
    res.status(500).json({ error: 'Error fetching data from server' });
    return;
  }
  if (!result.ok) {
    console.error('Error fetching data from server');
    res.status(500).json({ error: 'Error fetching data from server' });
    return;
  }
  const dataofresult = await result.text();
  await setter(`${type}_${period}`, dataofresult);
  const data = {
    data: JSON.parse(dataofresult),
    info: {
      cached: false,
      time: timerEnd(timer),
    },
  };
  res.json(data);
});
