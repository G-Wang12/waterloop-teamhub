const data = require('../../../../backend/data/index');
const cookie = require('cookie');

module.exports = async (req, res) => {
    await data.initIfNotStarted();
    if (req.method === 'DELETE') {
        // Get the Access Token from the request headers
        const token = cookie.parse(req.headers.cookie).token;
        const authStatus = await data.auth.checkSpecificUser(
            token,
            req.query.id,
            res
        );
        if (authStatus) {
            res.setHeader('Content-Type', 'application/json');

            if (!req.query.id) {
                res.statusCode = 400;
                res.end(
                    JSON.stringify(
                        await data.util.resWrapper(async () => {
                            throw Error('id URL param must be specified.');
                        })
                    )
                );
                return;
            }
            res.statusCode = 200;
            res.end(
                JSON.stringify(
                    await data.util.resWrapper(async () => {
                        return await data.members.delete({ _id: req.query.id });
                    })
                )
            );
        }
    } else {
        res.statusCode = 404;
        res.end();
    }
};
