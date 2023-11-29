import redis from 'redis';

const client = redis.createClient();

client.on('connect', () => {
  console.log('Redis client connected to the server');
});

client.on('error', (err) => {
  console.log(`Redis client not connected to the server: ${err.message}`);
});

// Function to set a new school value in Redis
const setNewSchool = (schoolName, value) => {
  client.set(schoolName, value, redis.print);
};

// Function to display the value for a given school key in Redis
const displaySchoolValue = (schoolName) => {
  client.get(schoolName, (err, reply) => {
    if (err) {
      console.error(`Error retrieving value for ${schoolName}: ${err.message}`);
    } else {
      console.log(reply);
    }
  });
};

// Example usage
displaySchoolValue('Holberton');
setNewSchool('HolbertonSanFrancisco', '100');
displaySchoolValue('HolbertonSanFrancisco');
