import express from 'express';
import kue from 'kue';
import redis from 'redis';
import { promisify } from 'util';

const app = express();
const port = 1245;

const redisClient = redis.createClient();
const hgetAsync = promisify(redisClient.hget).bind(redisClient);
const hsetAsync = promisify(redisClient.hset).bind(redisClient);

// Function to reserve a seat
const reserveSeat = async (number) => {
  await hsetAsync('available_seats', 'numberOfAvailableSeats', number);
};

// Function to get current available seats
const getCurrentAvailableSeats = async () => {
  const result = await hgetAsync('available_seats', 'numberOfAvailableSeats');
  return result ? parseInt(result) : 0;
};

// Set the initial number of available seats to 50
reserveSeat(50);

// Initialize reservationEnabled to true
let reservationEnabled = true;

// Create Kue queue
const queue = kue.createQueue();

// Route to get the number of available seats
app.get('/available_seats', async (req, res) => {
  const numberOfAvailableSeats = await getCurrentAvailableSeats();
  res.json({ numberOfAvailableSeats: numberOfAvailableSeats.toString() });
});

// Route to reserve a seat
app.get('/reserve_seat', (req, res) => {
  if (!reservationEnabled) {
    res.json({ status: 'Reservation are blocked' });
  } else {
    const job = queue.create('reserve_seat').save((err) => {
      if (err) {
        res.json({ status: 'Reservation failed' });
      } else {
        res.json({ status: 'Reservation in process' });
      }
    });

    job.on('complete', () => {
      console.log(`Seat reservation job ${job.id} completed`);
    });

    job.on('failed', (errorMessage) => {
      console.log(`Seat reservation job ${job.id} failed: ${errorMessage}`);
    });
  }
});

// Route to process the queue and decrease available seats
app.get('/process', async (req, res) => {
  res.json({ status: 'Queue processing' });

  await queue.process('reserve_seat', async (job, done) => {
    const currentAvailableSeats = await getCurrentAvailableSeats();

    if (currentAvailableSeats <= 0) {
      done(new Error('Not enough seats available'));
      reservationEnabled = false;
    } else {
      await reserveSeat(currentAvailableSeats - 1);
      done();
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
