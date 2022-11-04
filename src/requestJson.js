const fs = require('fs').promises;
const path = require('path');

const route = path.resolve(__dirname, './talker.json');

const requestTalker = async () => {
    const response = await fs.readFile(route, 'utf-8');
    const responseParse = JSON.parse(response);

    return responseParse;
};

const newRegistration = (email, password) => {
    const newObj = {
        email,
        password,
    }
    const newPerson = JSON.stringify(newObj);
    return newPerson;
}

module.exports = {
requestTalker,
newRegistration,
}
