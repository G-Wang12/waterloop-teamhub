const util = {};

/**
 * check if body is empty
 */
util.checkIsEmptyBody = async (body) => {
    return !body || Object.keys(body).length === 0;
};

/**
 * For each element in the array, retrieves the ID of a document by the name of the document, or creates a new document and returns its ID if it does not exist
 */
util.replaceNamesWithIdsArray = async (
    values,
    handler,
    createRecordIfNotFound = true
) => {
    if (!values) return values;
    const ids = [];
    if (createRecordIfNotFound) {
        for (const value of values) {
            const id = (await handler.findOrCreate({ name: value })).id;
            ids.push(id);
        }
    } else {
        for (const value of values) {
            let subteams = await handler.search({ name: value });
            // If the subteam cannot be found, simply skip it.
            // For now, ignore subteams that could not be found in the database
            if (subteams && subteams.length === 1) {
                const id = subteams[0].id;
                ids.push(id);
            }
        }
    }
    return ids;
};

/**
 * For each element in the array, retrieves the ID of a document by the body of the document, or creates a new document and returns its ID if it does not exist
 */
util.replaceBodiesWithIdsArray = async (values, handler) => {
    if (!values) return values;
    const ids = [];
    for (const value of values) {
        const id = (await handler.findOrCreate(value)).id;
        ids.push(id);
    }
    return ids;
};

/**
 * Retrieves the ID of a document by the name of the document, or creates a new document and returns its ID if it does not exist
 */
util.replaceNameWithId = async (value, handler) => {
    if (!value) return value;
    return (await handler.findOrCreate({ name: value })).id;
};

/**
 * Retrieves the ID of a document by the body of the document, or creates a new document and returns its ID if it does not exist
 */
util.replaceBodyWithId = async (value, handler) => {
    if (!value) return value;
    return (await handler.findOrCreate(value)).id;
};

/**
 * Finds a document by its body and returns it, if it does not exist, create it
 */
util.findOrCreate = async (Model, body) => {
    return await Model.findOneAndUpdate(body, body, {
        new: true,
        upsert: true,
        useFindAndModify: false,
    }).exec();
};

util.handleWrapper = async (func) => {
    return await func();
};

/**
 * Returns an object to be returned by an API endpoint with the success status and the data from a function call
 */
util.resWrapper = async (func) => {
    try {
        const body = await func();
        return {
            success: true,
            body,
        };
    } catch (error) {
        console.error(error);
        return {
            success: false,
            error: error.toString(),
        };
    }
};

module.exports = util;
