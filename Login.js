let xmlhttp,
    myAjax = (type, url) => {
        if (window.XMLHttpRequest) {
            xmlhttp = new XMLHttpRequest();
        } else {
            xmlhttp = new ActiveXObject('Microsoft.XMLHTTP');
        }
        xmlhttp.open(type, url, true);
        xmlhttp.send();
        return new Promise((resolve, reject) => {
            xmlhttp.onreadystatechange = () => {
                if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                    resolve(JSON.parse(xmlhttp.responseText))
                } else {
                    new Error('requset err')
                }
            };
        })
    }


function Login() {
    var username = document.getElementById("u");
    var pass = document.getElementById("p");

    // if (usernmae.value && pass.value) {
    //     myAjax('get', `http://127.0.0.1:3000/Login?user=${username.value}&pass=${pass.value}`).then(res => {
    //         console.log(res)
    //         alert(res.msg)

    //     })
    // } else {
    //     alert('Username/Password not Found')
    // }



}



