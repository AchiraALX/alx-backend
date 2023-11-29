import redis from 'redis';

const client = redis.createClient();

client.on('connect', () => {
  console.log('Redis client connected to the server');
});

client.on('error', (err) => {
  console.log(`Redis client not connected to the server: ${err.message}`);
});

// Creating Hash using hset
client.hset(
  'HolbertonSchools',
  'Portland',
  50,
  redis.print
);

client.hset(
  'HolbertonSchools',
  'Seattle',
  80,
  redis.print
);

client.hset(
  'HolbertonSchools',
  'New York',
  20,
  redis.print
);

client.hset(
  'HolbertonSchools',
  'Bogota',
  20,
  redis.print
);

client.hset(
  'HolbertonSchools',
  'Cali',
  40,
  redis.print
);

client.hset(
  'HolbertonSchools',
  'Paris',
  2,
  redis.print
);

// Displaying Hash using hgetall
client.hgetall('HolbertonSchools', (err, reply) => {
  if (err) {
    console.error(`Error retrieving hash: ${err.message}`);
  } else {
    console.log(reply);
  }
});

// Close the connection after displaying the hash
client.quit();
