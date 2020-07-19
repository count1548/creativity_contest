const sendAjax = (url : string, data : object) => {
    const senddata = JSON.stringify(data);
    // content-type을 설정하고 데이터 송신
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    xhr.setRequestHeader('Content-type', "application/json");
    xhr.send(senddata);

    // 데이터 수신이 완료되면 표시
    xhr.addEventListener('load', function(){
        console.log(xhr.responseText);
    });
}

export default sendAjax;