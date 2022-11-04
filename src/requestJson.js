const fs = require('fs').promises;
const path = require('path');

const route = path.resolve(__dirname, './talker.json');

const requestTalker = async () => {
    const response = await fs.readFile(route, 'utf-8');
    const responseParse = JSON.parse(response);

    return responseParse;
};

module.exports = requestTalker;
