const Task = require('../schema/Task');
const Member = require('../schema/Member');
const util = require('./util');

const task = {};
var ObjectID = require('mongodb').ObjectID;

/**
 * Return tasks stored in the database.
 * 
 * userId: id of the user
 * status: status of the task: 'pending', 'complete', or 'irrelavent'
 */
task.get = async (userId, status) => {
    return util.handleWrapper(async () => {

        const filter = status ? {_id: new ObjectID(userId), "tasks.status": status} : {_id: new ObjectID(userId)};

        const query = Member.find(filter)
                            .select("tasks")
                            .deepPopulate('tasks.taskId');

        return (await query.exec());
    });
};


/**
 * body: the filter to apply when retrieving task records from the database 
 * 
 * Return only the tasks that satisfy the filter criteria (body).
 * If no such records exist, then create a new database entry.
 */
task.add = async (body) => {
    return util.handleWrapper(async () => {
        return (await Task.create(body));
    });
};

module.exports = task;