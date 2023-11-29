import kue from 'kue';

const queue = kue.createQueue();

// Function to send a notification
const sendNotification = (phoneNumber, message) => {
  console.log(`Sending notification to ${phoneNumber}, with message: ${message}`);
};

// Process jobs in the push_notification_code queue
queue.process('push_notification_code', (job, done) => {
  const { phoneNumber, message } = job.data;
  sendNotification(phoneNumber, message);
  done();
});

// Event handler for completed jobs
queue.on('job complete', (id, result) => {
  kue.Job.get(id, (err, job) => {
    if (err) return;
    job.remove((err) => {
      if (err) throw err;
      console.log(`Removed completed job #${job.id} from queue`);
    });
  });
});

// Handle shutdown gracefully
process.once('SIGTERM', () => {
  queue.shutdown(5000, (err) => {
    console.log('Kue shutdown: ', err || 'OK');
    process.exit(0);
  });
});

// Log when the processor is ready
console.log('Job processor is ready, waiting for jobs...');
