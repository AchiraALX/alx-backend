import kue from 'kue';

const createPushNotificationsJobs = (jobs, queue) => {
  // Check if jobs is an array
  if (!Array.isArray(jobs)) {
    throw new Error('Jobs is not an array');
  }

  // Loop through the jobs array and create jobs in the queue
  jobs.forEach((jobData) => {
    const notificationJob = queue.create('push_notification_code_3', jobData);

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
};

export default createPushNotificationsJobs;
