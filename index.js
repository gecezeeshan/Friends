const app = require("./app");
const user = require("./user");

console.log('hi');
user.init().then(() => app.listen(3001));