global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;

jest.setTimeout(15000);

const data = require('../backend/data/index');
const skills = require('../backend/data/handlers/skills');
const Member = require('../backend/data/schema/Member');

beforeAll(async () => {
    await data.initIfNotStarted();
});

afterAll(async () => {
    await Member.deleteMany({});
});

describe('Testing Utility functions', () => {
    it('Test Handle Wrapper', async () => {
        const test = async () => {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve('resolved');
                }, 2000);
            });
        };

        expect(await data.util.handleWrapper(test)).toBe('resolved');
    });

    it('Tests Res Wrapper', async () => {
        await Member.create({
            name: {
                first: 'Stephane',
                last: 'Basil',
            },
            email: 'steph.basil@waterloop.ca',
        });

        const resp = await data.util.resWrapper(async () => {
            return await data.members.getAll();
        });

        expect(resp.success).toBe(true);
        expect(resp.body.length).toBeGreaterThan(0); // Check that members were returned

        await Member.deleteMany({});
    });

    it('Tests retrieving ID or creating new document', async () => {
        const resp = await data.util.replaceBodyWithId(
            [
                {
                    name: 'MongoDB',
                    category: 'Software',
                },
            ],
            skills
        );

        // Check that the string returned is ID, 24 char
        expect(resp.length).toBe(24);
    });

    it('Tests retrieving IDs for multiple document bodies', async () => {
        const resp = await data.util.replaceBodiesWithIdsArray(
            [
                {
                    name: 'Eating Cheese',
                    category: 'Misc',
                },
            ],
            skills
        );

        // Check if array contains ids
        expect(resp[0].length).toBe(24);
    });
});

afterAll(() => {
    data.close();
});
