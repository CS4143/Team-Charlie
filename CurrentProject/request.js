


const host = 'http://127.0.0.1:3000/api'
// const host = 'http://192.168.0.21:3000/api'

class Utility {

  static UrlMap = {
    Register: `${host}/signUp`,
    Login: `${host}/Login`,
    Logout: `${host}/Logout`,//                 exist login
    Creator: `${host}/creator`,  //             post,put,delete 
    CreatorAll: `${host}/creator/all`,  //      user creator list
    SearchByUsername: `${host}/search`, //      username serach 
    Firend: `${host}/firend`, //                get,post,put,delete
  }

  /**
   * 
   *
   * @static
   * @param {*} options = {url:'', data:{},method}
   * @memberof Utility
   */
  static async Ajax(options) {
    return new Promise((resolve, reject) => {

      options = options || {};
      options.method = (options.method || "GET").toUpperCase();
      options.dataType = options.dataType || "json";
      var params = this.formatParams(options.params);
      if (window.XMLHttpRequest) {
        var xhr = new XMLHttpRequest()
      } else {
        var xhr = new ActiveXObject("Microsoft.XMLHTTP")
      }

      const setToken = () => {

        const token = Utility.getContent('token');
        if (token) {
          xhr.setRequestHeader('token', token);
        }
      }

      xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
          var status = xhr.status;
          const body = JSON.parse(xhr.response);
          if (status >= 200 && status < 300) {
            const { data } = body || {};
            resolve({ ...data });
          } else {
            switch (status) {
              case 401:
                Utility.removeContent('token');
                Utility.toPage('login');
                break;
            }
            const { msg } = body;
            if (msg) {
              Utility.Alert(msg);
            }
            reject({ status, err: xhr });
          }
        }
      };
      if (options.method == "GET") {
        xhr.open("GET", options.url + "?" + params, true);
        setToken();
        xhr.send(null)
      } else if (['POST', 'PUT', 'DELETE'].includes(options.method)) {
        if (params) {
          options.url = options.url + "?" + params
          console.log('options.url:', options)
        }
        xhr.open(options.method, options.url, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        setToken();
        xhr.send(JSON.stringify(options.data))
      } else {
        console.log('method not found...');
      }
    })
  }

  static async $onGet({ url, params }) {
    return this.Ajax({ method: 'get', url, params });
  }

  static async $onPost({ url, params, data }) {
    return this.Ajax({ method: 'post', url, params, data });
  }

  static async $onPut({ url, params, data }) {
    return this.Ajax({ method: 'put', url, params, data });
  }

  static async $onDelete({ url, params, data }) {
    return this.Ajax({ method: 'delete', url, params, data });
  }

  static formatParams(data) {
    var arr = [];
    for (var name in data) {
      arr.push(encodeURIComponent(name) + "=" + encodeURIComponent(data[name]))
    } arr.push(("v=" + Math.random()).replace(".", "")); return arr.join("&")
  }

  static cloneObj(oldObj) {
    if (typeof oldObj != "object")
      return oldObj;
    if (oldObj == null) return oldObj;
    var newObj = new Object();
    for (var prop in oldObj)
      newObj[prop] = oldObj[prop];
    return newObj
  }

  static extendObj() {
    var args = arguments; if (args.length < 2) {
      return
    }
    var temp = cloneObj(args[0]);
    for (var n = 1, len = args.length; n < len; n++) {
      for (var index in args[n]) {
        temp[index] = args[n][index]
      }
    } return temp
  }

  /**
   *alert msg
   *
   * @static
   * @param {*} msg
   * @memberof Utility
   */
  static Alert(msg) {
    console.log('-->', msg)
    alert(msg)
  }

  /**
   * get element value
   *
   * @static
   * @param {*} name
   * @returns
   * @memberof Utility
   */
  static GetEleValue(name) {
    var val = document.getElementById(name);
    if (val) {
      return val.value;
    }

    var names = document.getElementsByName(name);
    if (names.length > 0) {
      return names[0].value;
    }
  }

  static createElementA(attrs = {}) {
    var a = document.createElement('a');
    Object.keys(attrs).forEach((key) => {
      a.setAttribute(key, attrs[key]);
    })
    return a;
  }


  /**
   * save value to session storage 
   *
   * @static
   * @param {*} key
   * @param {*} value
   * @memberof Utility
   */
  static setContent(key, value) {
    window.sessionStorage.setItem(key, JSON.stringify(value));
  }

  /**
   * remove value from session storage 
   *
   * @static
   * @param {*} key
   * @memberof Utility
   */
  static removeContent(key) {
    window.sessionStorage.removeItem(key);
  }

  /**
   * get value from session storage
   *
   * @static
   * @param {*} key
   * @returns
   * @memberof Utility
   */
  static getContent(key) {
    const val = window.sessionStorage.getItem(key);
    if (val) {
      try {
        return JSON.parse(val);
      } catch (ex) {
        return null;
      }
    }
    return null;
  }

  static toPage(url) {
    switch (url) {
      case 'goBack':
        window.history.back();
        break;
      case 'login':
        window.location.href = 'Login.html'
        break;
      case 'menu':
        window.location.href = "Menu.html";
        break;
    }
  }

  static parseUrlParams(url) {
    const item = url.split('?');
    const queryStr = item[item.length - 1];
    if (!queryStr) {
      return {};
    }
    const query = {};
    queryStr.split('&').forEach((str) => {
      var kv = str.split('=');
      query[kv[0]] = kv[1];
    });
    return query;
  }
}


class UserInfo {

  /**
   * user register
   *
   * @returns
   * @memberof UserInfo
   */
  async register() {

    let ui = {
      user: Utility.GetEleValue('re-name'),
      pass: Utility.GetEleValue('re-pass'),
      confirmPwd: Utility.GetEleValue('re2-pass'),
    }

    if (ui.confirmPwd != ui.pass) {
      Utility.Alert(`Passwords can't match each other!!`);
      return;
    }

    await Utility.$onPost({ url: Utility.UrlMap.Register, params: ui, data: ui });
    Utility.Alert("Congratulations on registration");

    // close register popup
    document.querySelector(".popup").style.display = "none";
  }

  /**
   * user login
   *
   * @memberof UserInfo
   */
  async submit() {
    const data = {
      name: Utility.GetEleValue('u'),
      pass: Utility.GetEleValue('p')
    }
    Utility.removeContent('token');
    const result = await Utility.$onPost({ url: Utility.UrlMap.Login, params: data, data });
    if (result.token) {
      Utility.setContent('token', result.token);
    }
    Utility.toPage('menu');

  }
}

class Creator {

  init() {
    // get uer params
    const query = Utility.parseUrlParams(window.location.href);
    if (!query.id) {
      return;
    }

    this.initElementValue(query.id);
  }

  async  submit() {
    // get all text;
    const numberItems = document.querySelectorAll('input[type="number"]');
    const textItems = document.querySelectorAll('input[type="text"]');
    const checkboxItems = document.querySelectorAll('input[type="checkbox"]');
    const selectItems = document.querySelectorAll('select');

    const textareaItems = document.querySelectorAll('textarea');



    let data = {};

    data.textareaMap = {};
    textareaItems.forEach((ele) => {
      data.textareaMap[ele.id || ele.name] = ele.value;
    })



    data.numberMap = {};

    numberItems.forEach((ele) => {
      data.numberMap[ele.id || ele.name] = ele.value;
    });

    data.textMap = {};
    textItems.forEach((ele) => {
      data.textMap[ele.id || ele.name] = ele.value;
    })

    data.textMap.Ht_Result = data.textMap['HP'] * 10;

    data.selectMap = {};
    selectItems.forEach((ele) => {

      data.selectMap[ele.id || ele.name] = ele.value;
    })

    data.checkMap = {};
    checkboxItems.forEach((ele) => {
      if (!data.checkMap[ele.id || ele.name]) {
        data.checkMap[ele.id || ele.name] = {};
        console.log('ele.name:', ele.name);
      }
      if (ele.checked) {
        data.checkMap[ele.id || ele.name][ele.value] = ele.value;
        console.log('name:', ele.name, 'value:', ele.value);
      }
    })
    if (!data.textMap.CharacterName) {
      Utility.Alert('Please enter input character name');
      document.getElementsByName('CharacterName')[0].focus();
      return;
    }
    console.log(data);

    // return;
    const query = Utility.parseUrlParams(window.location.href);
    console.log('---------submit------judge save or modify--', query);

    // name is not empty

    if (query.id) {
      await Utility.$onPut({ url: Utility.UrlMap.Creator, params: { id: query.id }, data });
    } else {
      await Utility.$onPost({ url: Utility.UrlMap.Creator, data });
    }

    Utility.Alert('save success');
    Utility.toPage('goBack');
  }



  async initElementValue(id) {
    const numberItems = document.querySelectorAll('input[type="number"]');
    const textItems = document.querySelectorAll('input[type="text"]');
    const checkboxItems = document.querySelectorAll('input[type="checkbox"]');
    const selectItems = document.querySelectorAll('select');
    const textareaItems = document.querySelectorAll('textarea');

    let data = await Utility.$onGet({ url: Utility.UrlMap.Creator, params: { id } });
    console.log(data);

    numberItems.forEach((ele) => {
      if (data.numberMap[ele.id || ele.name]) {
        ele.value = data.numberMap[ele.id || ele.name];
      }
    });

    textItems.forEach((ele) => {
      ele.value = data.textMap[ele.id || ele.name] || '';
    })

    selectItems.forEach((ele) => {
      ele.value = data.selectMap[ele.id || ele.name] || '';
    })

    checkboxItems.forEach((ele) => {
      if (data.checkMap[ele.id || ele.name]) {
        ele.checked = data.checkMap[ele.id || ele.name][ele.value] ? true : false;
      }
    })


    textareaItems.forEach((ele) => {
      ele.value = data.textareaMap[ele.id || ele.name];
    })

  }

  async myFirend() {
    const { list } = await Utility.$onGet({ url: Utility.UrlMap.Firend });
    console.log('list:', list);
    const element = document.getElementById('firendListTableBody');
    // <td onclick="creator.selectFirend(this,'${row.firend_name}')"><input type="checkbox" name="myFirendList" value="${row.firend_name}"> ${row.firend_name}</td>
    let html = '';
    list.forEach((row) => {
      html += `
          <tr>
              <td onclick="creator.selectFirend(this,'${row.firend_name}')" class="${row.is_master ? 'master' : ''}">${row.firend_name}</td>
          </tr>
      `
    })

    element.innerHTML = html;
  }

  async selectFirend(event, firendName) {

    this.currentSelectFirend = firendName;
    console.log('this.currentSelectFirend', event, this.currentSelectFirend);
    const allTd = event.parentElement.parentElement.querySelectorAll('td')
    allTd.forEach((td) => {
      td.classList.remove('select');
    })
    event.classList.add('select');
  }

  async removeCurrentSelectFirend() {
    console.log('current firend name', this.currentSelectFirend);
    const name = this.currentSelectFirend;
    await Utility.$onDelete({ url: Utility.UrlMap.Firend, data: { name } });
    this.myFirend();
  }

  async setCurrentSelectFirendMaster() {
    console.log('current firend name', this.currentSelectFirend);
    const name = this.currentSelectFirend;

    await Utility.$onPut({ url: Utility.UrlMap.Firend, data: { name } });

    this.myFirend();
  }


  async myList() {
    const { list } = await Utility.$onGet({ url: Utility.UrlMap.CreatorAll });
    console.log('list:', list);


    const ele = document.getElementById("dropwown-content");
    ele.innerHTML = "";
    let html = '';
    list.forEach((item) => {
      const { id, creator_name } = item;
      const attrs = { href: `/creator.html?id=${id}`, name: creator_name };
      const a = Utility.createElementA(attrs);
      a.innerText = creator_name;
      ele.appendChild(a);


      html += `
      <div style="display:flex;background:hsl(240, 3%, 54%),border-radius: 15px;margin-bottom: 5px;">
        <a style="flex:1" href="/creator.html?id=${id}" name="${creator_name}" >${creator_name}</a>
        <button style="background:hsl(240,3%,54%); border: unset;height: 41px;margin-top: 5px; margin-left: -11px;border-radius: 5px;" onclick="creator.deleteCreator(this,${id})">delete</button>
      </div>
      `
    })

    ele.innerHTML = html;
  }

  async deleteCreator(source, id) {
    console.log(id);
    // debugger;
    const info = await Utility.$onDelete({ url: Utility.UrlMap.Creator, params: { id } });
    console.log('info:', info);
    
    this.myList();
 
    // source.parentElement.remove();
  }

  async search() {
    const name = Utility.GetEleValue('firendName');
    if (!name) {
      Utility.Alert('please enter username');
      return;
    }

    const { list } = await Utility.$onGet({ url: Utility.UrlMap.SearchByUsername, params: { name } });
    console.log(list);

    let html = '';

    list.forEach((row) => {

      html += `
      <div class="firend-list-item">
        <div class="firend-list-username">${row.name}</div>
        <button onclick="creator.addFirend(this,'${row.name}')">add</button>
      </div>
      `
    })

    const parentElement = document.getElementById('firendList');
    parentElement.innerHTML = html;

  }

  async addFirend(event, name) {
    console.log('event', event, name);

    await Utility.$onPost({ url: Utility.UrlMap.Firend, data: { name } });

    this.myFirend();
  }

  async logout() {
    const a = await Utility.$onPut({ url: Utility.UrlMap.Logout });
    console.log(a);
    console.log('logout...');
    Utility.removeContent('token');
    Utility.toPage('login');
  }
}
