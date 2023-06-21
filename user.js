const { query } = require('express');
const db = require('./database');

const init = async () => {
  await db.run('CREATE TABLE Users (id INTEGER PRIMARY KEY AUTOINCREMENT, name varchar(32));');
  await db.run('CREATE TABLE Friends (id INTEGER PRIMARY KEY AUTOINCREMENT, userId int, friendId int);');
  const users = [];
  const names = ['foo', 'bar', 'baz'];
  for (i = 0; i < 100; ++i) {
    let n = i;
    let name = '';
    for (j = 0; j < 3; ++j) {
      name += names[n % 3];
      n = Math.floor(n / 3);
      name += n % 10;
      n = Math.floor(n / 10);
    }
    users.push(name);
  }
  const friends = users.map(() => []);
  for (i = 0; i < friends.length; ++i) {
    const n = 10 + Math.floor(90 * Math.random());
    const list = [...Array(n)].map(() => Math.floor(friends.length * Math.random()));
    list.forEach((j) => {
      if (i === j) {
        return;
      }
      if (friends[i].indexOf(j) >= 0 || friends[j].indexOf(i) >= 0) {
        return;
      }
      friends[i].push(j);
      friends[j].push(i);
    });
  }
  console.log("Init Users Table...");
  await Promise.all(users.map((un) => db.run(`INSERT INTO Users (name) VALUES ('${un}');`)));
  console.log("Init Friends Table...");
  await Promise.all(friends.map((list, i) => {
    return Promise.all(list.map((j) => db.run(`INSERT INTO Friends (userId, friendId) VALUES (${i + 1}, ${j + 1});`)));
  }));
  console.log("Ready.");
}
module.exports.init = init;

const search = async (req, res) => {

  const query = req.params.query;
  const userId = parseInt(req.params.userId);

  db.all(`SELECT id, name, id in (SELECT friendId from Friends 
    where (userId = ${userId} or  ${userId} = '')) as connection from Users 
    where name = '${query}' 
    --LIMIT 20
    ;`).then((results) => {
    res.statusCode = 200;
    res.json({
      success: true,
      users: results
    });
  }).catch((err) => {
    res.statusCode = 500;
    res.json({ success: false, error: err });
  });
}
module.exports.search = search;


const allUsers = async (req, res) => {
  db.all(`SELECT *  from Users `).then((results) => {
    res.statusCode = 200;
    res.json({
      success: true,
      users: results
    });
  }).catch((err) => {
    res.statusCode = 500;
    res.json({ success: false, error: err });
  });
}
module.exports.allUsers = allUsers;

const allFriendById = async (req, res) => {
  const query = req.params?.query;
  db.all(`SELECT f.friendId,u.name 
  from Friends f
  join Users u
  on u.Id = f.UserId
  where (userId = '${query}' )
   `).then((results) => {
    res.statusCode = 200;
    res.json({
      success: true,
      users: results
    });
  }).catch((err) => {
    res.statusCode = 500;
    res.json({ success: false, error: err });
  });
}
module.exports.allFriendById = allFriendById;



const allFriends = async (req, res) => {
  const query = req.params?.query;
  db.all(`SELECT u.Id,f.friendId,u.name 
  from Friends f
  join Users u
  on u.Id = f.UserId   `).then((results) => {
    res.statusCode = 200;
    res.json({
      success: true,
      users: results
    });
  }).catch((err) => {
    res.statusCode = 500;
    res.json({ success: false, error: err });
  });
}
module.exports.allFriends = allFriends;


const unfriend = async (req, res) => {
  const friendId = req.params.friendId;
  const userId = parseInt(req.params.userId);
  query1 = `delete from Friends where userId = '${userId}' and   friendId = '${friendId}'  `;
  db.all(query1).then((results) => {
    res.statusCode = 200;
    res.json({
      success: true,
      users: results
    });
  }).catch((err) => {
    res.statusCode = 500;
    res.json({ success: false, error: err });
  });
}
module.exports.unfriend = unfriend;


const Friend = async (req, res) => {
  const friendId = req.params.friendId;
  const userId = parseInt(req.params.userId);
  query1 = `INSERT INTO Friends (userId, friendId) 
  VALUES (${userId}, ${friendId});`;
  await db.run(query1).then((results) => {
    res.statusCode = 200;
    res.json({
      success: true,
      users: results
    });
  }).catch((err) => {
    res.statusCode = 500;
    res.json({ success: false, error: err });
  });
}
module.exports.Friend = Friend;