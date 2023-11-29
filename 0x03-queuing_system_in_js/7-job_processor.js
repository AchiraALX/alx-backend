import kue from 'kue';

const queue = kue.createQueue();

// Array of blacklisted phone numbers
const blacklistedNumbers = ['4153518780', '4153518781'];

// Function to send a notification
const sendNotification = (phoneNumber, message, job, done) => {
  // Track the progress of the job
  job.progress(0, 100);

  // Check if the phone number is blacklisted
  if (blacklistedNumbers.includes(phoneNumber)) {
    const errorMessage = `Phone number ${phoneNumber} is blacklisted`;
    // Fail the job with an Error object and the blacklisted message
    return done(new Error(errorMessage));
  }

  // Track the progress to 50%
  job.progress(50, 100);

  // Log the notification message
  console.log(`Sending notification to ${phoneNumber}, with message: ${message}`);

  // Indicate that the job is done
  done();
};

// Process jobs in the push_notification_code_2 queue
queue.process('push_notification_code_2', 2, (job, done) => {
  const { phoneNumber, message } = job.data;
  sendNotification(phoneNumber, message, job, done);
});

// Event handler for completed jobs
queue.on('job complete', (id) => {
  kue.Job.get(id, (err, job) => {
    if (err) return;
    job.remove((err) => {
      if (err) throw err;
      console.log(`Notification job #${job.id} completed`);
    });
  });
});

// Event handler for failed jobs
queue.on('job failed', (id, err) => {
  kue.Job.get(id, (err, job) => {
    if (err) return;
    console.log(`Notification job #${job.id} failed: ${err.message}`);
  });
});

// Log when the processor is ready
console.log('Job processor is ready, waiting for jobs...');
