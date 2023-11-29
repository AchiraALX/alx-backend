import kue from 'kue';

const queue = kue.createQueue();

// Array of job data
const jobs = [
  { phoneNumber: '4153518780', message: 'This is the code 1234 to verify your account' },
  { phoneNumber: '4153518781', message: 'This is the code 4562 to verify your account' },
  { phoneNumber: '4153518743', message: 'This is the code 4321 to verify your account' },
  { phoneNumber: '4153538781', message: 'This is the code 4562 to verify your account' },
  { phoneNumber: '4153118782', message: 'This is the code 4321 to verify your account' },
  { phoneNumber: '4153718781', message: 'This is the code 4562 to verify your account' },
  { phoneNumber: '4159518782', message: 'This is the code 4321 to verify your account' },
  { phoneNumber: '4158718781', message: 'This is the code 4562 to verify your account' },
  { phoneNumber: '4153818782', message: 'This is the code 4321 to verify your account' },
  { phoneNumber: '4154318781', message: 'This is the code 4562 to verify your account' },
  { phoneNumber: '4151218782', message: 'This is the code 4321 to verify your account' }
];

// Loop through the jobs array and create jobs in the queue
jobs.forEach((jobData, index) => {
  const notificationJob = queue.create('push_notification_code_2', jobData);

  // Job creation success event
  notificationJob.on('enqueue', () => {
    console.log(`Notification job created: ${notificationJob.id}`);
  });

  // Job completion event
  notificationJob.on('complete', () => {
    console.log(`Notification job ${notificationJob.id} completed`);
  });

  // Job failure event
  notificationJob.on('failed', (err) => {
    console.log(`Notification job ${notificationJob.id} failed: ${err}`);
  });

  // Job progress event
  notificationJob.on('progress', (progress) => {
    console.log(`Notification job ${notificationJob.id} ${progress}% complete`);
  });

  // Save the job to the queue
  notificationJob.save((err) => {
    if (err) {
      console.error('Error creating notification job:', err);
    }
  });
});

// Handle shutdown gracefully
process.once('SIGTERM', () => {
  queue.shutdown(5000, (err) => {
    console.log('Kue shutdown: ', err || 'OK');
    process.exit(0);
  });
});

// Log when the creator is done
console.log('Job creator is done, all jobs queued.');
