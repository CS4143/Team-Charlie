const sqlite3 = require('sqlite3').verbose();

class DbHelper {

  sqlMap = {
    user_info: `create table user_info(
      id integer primary key autoincrement, 
      name varchar(20),
      pass varchar(20),
      createTime TIMESTAMP default (datetime('now', 'localtime'))
    )`,
    user_session: `create table user_session(
      id integer primary key autoincrement, 
      name varchar(20),
      token varchar(50),
      expire integer default (86400), 
      logtime TIMESTAMP default (datetime('now', 'localtime'))
      )`,
    user_creator: `create table user_creator(
        id integer primary key autoincrement, 
        name varchar(20),
        creator_name varchar(50),
        creator_cfg varchar(4000),
        createTime TIMESTAMP default (datetime('now', 'localtime'))
    )`,
    user_firend: `create table user_firend(
      id integer primary key autoincrement, 
      name varchar(20),
      firend_name  varchar(20),
      is_master integer default 0,
      createTime TIMESTAMP default (datetime('now', 'localtime'))
    )`
  }

  constructor() {
    this.open();
    this.createTable();
  }

  printLog() {
    try {
      const cDate = new Date();
      const tmp = cDate.toLocaleString() + ' ' + cDate.toLocaleTimeString();

      console.log(tmp, '-->', ...arguments);
    } catch (ex) {
      console.log(ex)
    }
  }

  open() {
    this.db = new sqlite3.Database('./server/db/sample.db', (err, data) => {
      // console.log(err, data);
    });
  }



  /**
   * create user table
   *
   * @returns
   * @memberof DbHelper
   */
  async createTable() {
    const keys = Object.keys(this.sqlMap);
    for (let i = 0; i < keys.length; i += 1) {
      const tableName = keys[i];
      this.printLog('create table :', tableName);
      const isExists = await this.JudgeTableExists(tableName);
      if (isExists) {
        this.printLog('[ ', tableName, ' ] table already exists');
        continue
      }
      await this.execSQL(this.sqlMap[tableName]);

      this.printLog(tableName, 'create success...');
    }

  }


  /**
   * query statement
   * 
   * @param {*} sql
   * @returns row 
   * @memberof DbHelper
   */
  async query(sql) {
    return new Promise((resolve, reject) => {
      this.printLog('query sql :[ ', sql, ' ]');
      try {

        this.db.get(sql, (err, data) => {

          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        });
      } catch (ex) {
        reject(ex);
      }
    })
  }

  /**
   * return rows
   *
   * @param {*} sql
   * @returns rows
   * @memberof DbHelper
   */
  async all(sql) {
    return new Promise((resolve, reject) => {
      this.printLog('query sql :[ ', sql, ' ]');
      this.db.all(sql, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      })
    });
  }


  /**
   * record is exists 
   *
   * @param {*} sql
   * @returns
   * @memberof DbHelper
   */
  async isExists(sql) {
    const result = await this.query(sql);
    if (!result) {
      return false;
    }
    const total = Object.values(result)[0];
    this.printLog('record total ', total);

    return total > 0
  }

  /**
   * judge table is exists
   *
   * @param {*} tableName
   * @returns
   * @memberof DbHelper
   */
  async JudgeTableExists(tableName) {
    const sql = `select count(*) total from sqlite_master where type='table'  and name = '${tableName}' `;
    return this.isExists(sql);
  }


  /**
   * insert statement
   *
   * @param {*} sql
   * @returns
   * @memberof DbHelper
   */
  async execSQL(sql) {
    return new Promise((resolve, reject) => {
      this.printLog('exec sql: [ ', sql, ' ]');
      this.db.run(sql, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data)
        }
      })
    })
  }
}


module.exports = new DbHelper();