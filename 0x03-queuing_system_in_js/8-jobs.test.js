import kue from 'kue';
import createPushNotificationsJobs from './8-job.js';
import { assert } from 'chai';

describe('createPushNotificationsJobs', function () {
  let queue;

  beforeEach(function () {
    // Create a queue and enter test mode
    queue = kue.createQueue();
    queue.testMode.enter();
  });

  afterEach(function () {
    // Clear the queue and exit test mode
    queue.testMode.exit();
  });

  it('should display an error message if jobs is not an array', function () {
    // Use chai's assert to check if an error is thrown
    assert.throws(() => createPushNotificationsJobs('not an array', queue), 'Jobs is not an array');
  });

  it('should create two new jobs to the queue', function () {
    const jobs = [
      { phoneNumber: '4153518780', message: 'This is the code 1234 to verify your account' },
      { phoneNumber: '4153518781', message: 'This is the code 5678 to verify your account' }
    ];

    // Call the function to create jobs
    createPushNotificationsJobs(jobs, queue);

    // Use assert to check if the correct number of jobs are in the queue
    assert.equal(queue.testMode.jobs.length, 2);

    // Use assert to check if the job data is correct
    assert.deepEqual(queue.testMode.jobs[0].data, jobs[0]);
    assert.deepEqual(queue.testMode.jobs[1].data, jobs[1]);

    // Use assert to check if the correct events are emitted
    assert.equal(queue.testMode.jobs[0].events[0], 'enqueue');
    assert.equal(queue.testMode.jobs[1].events[0], 'enqueue');
  });
});
