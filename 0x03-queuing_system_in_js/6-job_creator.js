import kue from 'kue';

const queue = kue.createQueue();

// Object containing the Job data
const jobData = {
  phoneNumber: '1234567890',
  message: 'This is a test notification'
};

// Create a job in the push_notification_code queue
const notificationJob = queue.create('push_notification_code', jobData);

// Job creation success event
notificationJob.on('enqueue', () => {
  console.log(`Notification job created: ${notificationJob.id}`);
  process.exit(0);
});

// Job completion event
notificationJob.on('complete', () => {
  console.log('Notification job completed');
  queue.shutdown(5000, (err) => {
    console.log('Kue shutdown: ', err || 'OK');
    process.exit(0);
  });
});

// Job failure event
notificationJob.on('failed', () => {
  console.log('Notification job failed');
  process.exit(1);
});

// Save the job to the queue
notificationJob.save((err) => {
  if (err) {
    console.error('Error creating notification job:', err);
    process.exit(1);
  }
});
