const path = require('path');
const http = require('http');
const url = require('url');
const formidable = require('formidable');
const DbHelper = require('./server/dbHelper');
const crypto = require('crypto');

const fs = require('fs')// a module to read and write file
const port = 3000

let mimeType = {};

fs.readFile('./mimeType.json', (err, data) => {
  if (err) throw Error(' mimeType.json file not found');
  JSON.parse(data).forEach(item => {
    Object.assign(mimeType, item)
  });
});


http.ServerResponse.prototype.send = function (data) {
  this.write(JSON.stringify(data || ''));
  this.end();
}

http.ServerResponse.prototype.notFound = function (data) {
  this.writeHead(404, 'method not found', { 'Content-Type': 'text/plain;charset=utf8' })
  this.send({ msg: 'method not found' });
}

http.ServerResponse.prototype.methodNotAllowed = function () {
  this.writeHead(405, 'method Not allowed', { 'Content-Type': 'text/plain;charset=utf8' })
  this.statusMessage = 'Method not allowed';
  this.end();
}



const server = http.createServer(function (req, res) {
  if (req.url == '/favicon.ico') return
  //console.log(mimeType)


  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "application/json;charset=utf-8");
  res.setHeader("Access-Control-Allow-Headers", "content-type");
  res.setHeader("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");
  res.setHeader("access-control-allow-headers", "x-pingother, origin, x-requested-with, content-type, accept, token, xiaotuni,systemdate,sessionid");


  if (req.method.toLowerCase() == 'options') {
    return res.send();
  }


  const pathName = url.parse(req.url).pathname// the entire address(IP+port+)


  const fileURL = path.normalize(__dirname + '/CurrentProject' + pathName);
  const typeName = path.extname(pathName);
  console.log('typeName:', typeName);
  if (typeName) {
    fs.readFile(fileURL, function (error, data) {
      if (error) {
        res.end('Error !!!')
      }
      //console.log(mimeType[typeName])
      //console.log(fileURL)
      res.writeHead(200, { 'Content-type': `${mimeType[typeName] || 'text/plain;charset=UTF-8'}` })
      res.end(data)

    })
    return;
  }



  const query = url.parse(req.url, true).query

  const { method } = req;
  const form = new formidable.IncomingForm();
  form.multiples = true;
  form.keepExtensions = true;
  form.parse(req, async (err, body, files) => {
    const token = req.headers.token;
    const api = new ApiHelper(req, res, token);

    const options = { token, method: method.toLowerCase(), query, body, files };
    DbHelper.printLog('method:', options.method, 'url:', pathName, 'token:', token);

    try {
      await api.JudgeTokenExpire(token);
      let funName = `Creator_${options.method}`;
      switch (pathName) {
        case '/api/signUp':
          await api.Register({ ...options });
          break;
        case '/api/Login':
          await api.Login({ ...options });
          break;
        case '/api/Logout':
          await api.Logout({ ...options });
          break;
        case '/api/creator/all':
          await api.NeedLogin(token);
          await api.CreatorList({ ...options });
          break;
        case '/api/creator':
          await api.NeedLogin(token);
          DbHelper.printLog('funName:', funName);
          if (api[funName]) {
            await api[funName]({ ...options });
          }
          else {
            res.methodNotAllowed();
          }
          break;
        case '/api/search':
          await api.Search({ ...options });
          break;
        case '/api/firend':
          await api.NeedLogin(token);
          funName = `Firend_${options.method}`;
          if (api[funName]) {
            await api[funName]({ ...options });
          }
          else {
            res.methodNotAllowed();
          }
          break;
        default:
          res.notFound();
          break;
      }
    } catch (ex) {
      console.log(ex);
      const { code } = ex || {};
      res.writeHead(code || 400, 'parameter is incorrect', { 'Content-Type': 'application/json;charset=utf-8' });
      res.send({ msg: ex.message || ex.msg });
    }
  });


  return;


  if (pathName == '/signUp') {

    //console.log(query)
    fs.readFile(__dirname + '/user.txt', function (error, data) {
      // console.log(data.toString())
      let content = data.toString();
      if (content) {
        content.replace(/{{(.*?)}}/g, function (node, key) {
          //console.log(node, key.slice(4, key.indexOf('&')))
          //console.log(1)
          if (query.user == key.slice(5, key.indexOf('&'))) {
            res.end(`{  "msg": "Username has already existed" }`)
          }
          else {
            fs.writeFile(__dirname + '/user.txt', `{{user=${query.user}&pass=${query.pass}}}`, { flag: 'a' }, function (err) {
              if (err) {
                console.error(err);
              } else {
                res.end(`{  "msg": "Register Completed" }`)
              }
            });
          }
        })
      }
      else {
        fs.writeFile(__dirname + '/user.txt', `{{user=${query.user}&pass=${query.pass}}}`, { flag: 'a' }, function (err) {
          if (err) {
            console.error(err);
          } else {
            res.end(`{  "msg": "Register Completed" }`)
          }
        });
      }

    })


  }
  else if (pathName == '/Login') {
    fs.readFile(__dirname + '/user.txt', function (error, data) {
      let content = data.toString();
      let bool = false;

      if (content) {
        content.replace(/{{(.*?)}}/g, function (node, key) {
          console.log(key.slice(5, key.indexOf('&')))
          console.log("This is user " + query.user)
          if (query.user == key.slice(5, key.indexOf('&')) && query.pass == key.slice((key.indexOf('&') + 6))) {
            bool = true

          }
        })
        if (bool) {
          res.end(`{  "msg": "Login Completed" }`)
        }
        else {
          res.end(`{  "msg": "Username/Password incorrect-----------" }`)
        }
      }
      else {
        res.end(`{  "msg": "Username/Password incorrect2" }`)
      }
    })
  }


  //res.end() will be read first so the readFile function can't be read
})

class ApiHelper {
  constructor(req, res, token) {
    this.req = req;
    this.res = res;
    this.token = token;
  }

  sendData(data) {

    this.res.send({ msg: 'ok', data: Object.assign({}, data || {}) });
  }
  send400(data) {
    this.res.writeHead(400, 'parameter is incorrect', { 'Content-Type': 'application/json;charset=utf-8' });
    const { msg = 'parameter is incorrect' } = data || {};
    this.res.send({ msg });
  }
  notFound(data) {
    this.res.notFound();
  }

  md5(val) {
    return crypto.createHash('md5').update(val).digest('hex').toString();
  }

  printLog() {
    DbHelper.printLog(...arguments);
  }
  methodNotAllowed() {
    this.res.methodNotAllowed();
  }

  async NeedLogin(token) {
    if (!token) {
      return Promise.reject({ code: 401, msg: 'need login' });
    }
    await this.JudgeTokenExpire(token);
  }

  async JudgeTokenExpire(token) {
    if (!token) {
      return;
    }
    let sql = `select * from user_session where token = '${token}' `;
    try {
      const info = await DbHelper.query(sql);
      if (!info) {
        return Promise.reject({ code: 401, msg: 'token expire' })
      }
      const logtime = new Date(info.logtime).getTime();
      const diffTime = new Date().getTime() - logtime;
      info.expire = ((info.expire || 0) * 1000)
      this.printLog('info.expire:', info.expire, 'info.logtime:', info.logtime, 'logtime:', logtime, 'diffTime:', diffTime);

      if (diffTime > info.expire) {
        DbHelper.printLog('token expire');
        sql = `delete from user_session where token = '${token}'`;
        await DbHelper.execSQL(sql);
        return Promise.reject({ code: 401, msg: 'token expire' })
      }

      return true;
    } catch (ex) {
      this.printLog(ex);
      return false;
    }
  }

  async Logout({ token, method, query, body }) {
    let sql = `delete from user_session where token = '${token}'`;
    await DbHelper.execSQL(sql);
    this.sendData();
  }

  async Login({ method, query, body }) {
    let sql = `select count(1) total from user_info where name = '${body.name}' and pass = '${body.pass}' `;
    const isExists = await DbHelper.isExists(sql);
    if (!isExists) {
      return Promise.reject({ msg: 'Username or password incorrec' });
    }

    // build session save to db
    var us = {
      name: body.name,
      token: this.md5(`${new Date().getTime()}_${body.name}`),

    }
    sql = `insert into user_session(name,token)values('${us.name}','${us.token}')`;
    await DbHelper.execSQL(sql);
    this.sendData({ token: us.token });

    // this.sendData();
  }

  async GetNameByToken() {
    let sql = `select * from user_session where token = '${this.token}' `;
    const info = await DbHelper.query(sql);
    return info.name;
  }

  async Register({ method, query, body }) {
    console.log('method:', method);
    if (method !== 'post') {
      this.methodNotAllowed();
      return;
    }

    let sql = `select count(*) total from user_info where name = '${body.user}'`;
    const isExists = await DbHelper.isExists(sql);
    if (isExists) {
      this.send400({ msg: 'user already exists' });
      return;
    }

    sql = `insert into user_info(name,pass) values('${body.user}','${body.pass}')`;
    await DbHelper.execSQL(sql);
    this.sendData({});
  }

  async CreatorList({ method, query, body }) {
    const name = await this.GetNameByToken();
    let sql = `select id,creator_name from user_creator where name = '${name}'`;
    const list = await DbHelper.all(sql);
    this.sendData({ list });
  }

  async Creator_get({ method, query, body }) {
    const name = await this.GetNameByToken();
    let sql = `select * from user_creator where name = '${name}' and id = '${query.id}'`;
    const info = await DbHelper.query(sql) || {};
    if (info.creator_cfg) {
      info.creator_cfg = JSON.parse(info.creator_cfg);
    }
    this.sendData({ ...info.creator_cfg });
  }

  async Creator_put({ method, query, body }) {

    const name = await this.GetNameByToken();
    const creator_name = body.textMap.CharacterName;

    let sql = `update user_creator set creator_cfg = '${JSON.stringify(body)}' ,creator_name = '${creator_name}'  where  name = '${name}' and id = '${query.id}'`;
    await DbHelper.execSQL(sql);
    this.sendData();
  }

  async Creator_post({ method, query, body }) {

    const name = await this.GetNameByToken();
    const creator_name = body.textMap.CharacterName;

    this.printLog('name:', name, 'creator_name:', creator_name);

    // judge creator already exists
    let sql = `select count(1) from user_creator where name = '${name}' and creator_name = '${creator_name}'`;
    const isExists = await DbHelper.isExists(sql);
    if (isExists) {
      this.send400({ msg: 'creator name already exists' });
      return;
    }
    sql = `insert into user_creator(name,creator_name,creator_cfg)values('${name}','${creator_name}','${JSON.stringify(body)}')`;
    await DbHelper.execSQL(sql);
    this.sendData({ msg: 'add success' });
  }

  async Creator_delete({ method, query, body }) {

    const { id } = query;
    this.printLog('id:', query.id);

    let sql = `delete from user_creator where id = '${id}'  `;
    await DbHelper.execSQL(sql);

    this.sendData({ msg: 'ok' });

  }


  async Search({ method, query, body }) {
    console.log(query);
    let sql = `select id,name from user_info where name like '%${query.name}%'`;
    const list = await DbHelper.all(sql);

    this.sendData({ list });
  }

  async Firend_get({ method, query, body }) {
    const name = await this.GetNameByToken();
    let sql = `select * from user_firend where name = '${name}'`;
    const list = await DbHelper.all(sql);
    this.sendData({ list });
  }
  async Firend_post({ method, query, body }) {
    const name = await this.GetNameByToken();
    const firend_name = body.name;
    // Whether the user exists
    let sql = `select * from user_firend where name = '${name}' and firend_name = '${firend_name}'`;
    const isExists = await DbHelper.isExists(sql);
    if (isExists) {
      this.sendData({ msg: 'User already exists' });
      return;
    }
    sql = `insert into user_firend(name,firend_name)values('${name}','${body.name}')`;
    await DbHelper.execSQL(sql);
    this.sendData();
  }
  async Firend_put({ method, query, body }) {
    const name = await this.GetNameByToken();
    const firend_name = body.name;
    let sql = `update user_firend set is_master = 0 where name = '${name}'`;
    await DbHelper.execSQL(sql);
    sql = `update user_firend set is_master = 1 where name = '${name}' and firend_name = '${firend_name}' `;
    await DbHelper.execSQL(sql);
    this.sendData()
  }
  async Firend_delete({ method, query, body }) {
    const name = await this.GetNameByToken();
    const firend_name = body.name;
    let sql = `delete from user_firend where name = '${name}' and firend_name = '${firend_name}' `;
    await DbHelper.execSQL(sql);
    this.sendData()
  }
}



server.listen(port, function (error) {
  if (error) {
    console.log('Something went wrong', error)
  } else {
    console.log('Server is listening on port' + port)
  }
})
