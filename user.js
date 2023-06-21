const db = require('./database');

const init = async () => {
  await db.run('CREATE TABLE Users (id INTEGER PRIMARY KEY AUTOINCREMENT, name varchar(32));');
  await db.run('CREATE TABLE Friends (id INTEGER PRIMARY KEY AUTOINCREMENT, userId int, friendId int);');
  const users = [];
  const names = ['foo', 'bar', 'baz'];
  for (i = 0; i < 10; ++i) {
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
  //console.log(users);
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

  const userId = parseInt(req.params.userId);
  var str = '';
  var querySt = `SELECT id, name, id in 
  (SELECT friendId from Friends where userId = ${userId}) as connection
   from Users '${str}' LIMIT 20;`;



  if (req.params.query != null) {
    const query = req.params.query;    
    querySt = `SELECT id, name, id in 
  (SELECT friendId from Friends where userId = ${userId}) as connection
   from Users  where name LIKE '${query}%'  LIMIT 20;`;
  }


  db.all(querySt).then((results) => {
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



const getUsers = async (req, res) => {
  const query = req.params.query;
  const userId = parseInt(req.params.userId);


  db.all(`SELECT id, name
   from Users where id = '${userId}';`).then((results) => {
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
module.exports.users = getUsers;


const getUserById = async (req, res) => {

  const userId = parseInt(req.params.userId);

  var query = `select u.id, u.name, (select name from users where id = f.friendId) as friendName from users u
join friends f
on u.id = f.userId
where u.id = '${userId}'
`;
  console.log(query);

  db.all(query).then((results) => {
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
module.exports.getUserById = getUserById;



const getAllUser = async (req, res) => {
  const query = req.params.query;
  const userId = parseInt(req.params.userId);

  var statmnt = `select u.id, u.name, f.id as FriendId, (select name from users where id = f.friendId) as friendName from users u
join friends f
on u.id = f.userId`;
  debugger;

  db.all(statmnt).then((results) => {
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
module.exports.getAllUser = getAllUser;





const unFriend = async (req, res) => {
  const friendId = parseInt(req.params.friendId);
  const userId = parseInt(req.params.userId);

  var statmnt = `delete from friends where userId = ${userId} and friendId = ${friendId}`;


  db.all(statmnt).then((results) => {
    res.statusCode = 200;
    res.json({
      success: true
    });
  }).catch((err) => {
    res.statusCode = 500;
    res.json({ success: false, error: err });
  });
}
module.exports.unFriend = unFriend;


const Friend = async (req, res) => {
  const friendId = parseInt(req.params.friendId);
  const userId = parseInt(req.params.userId);

  var statmnt = `INSERT INTO Friends (userId, friendId) VALUES (${userId}, ${friendId});`;


  db.all(statmnt).then((results) => {
    res.statusCode = 200;
    res.json({
      success: true
    });
  }).catch((err) => {
    res.statusCode = 500;
    res.json({ success: false, error: err });
  });
}
module.exports.Friend = Friend;

