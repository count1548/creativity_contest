const host = "http://210.119.104.154:3001"

class Auth {  
    login(info) {
      fetch(`${host}/login/`, {
        method: 'POST',
        headers:{
          'Content-Type': 'application/json'
        },
        body : JSON.stringify({
            'user' : info.id, 
            'passwd' : info.pwd,
        })
      }).then(res => res.json())
      .then(res => {
        console.log(res)
        if(res.message === '0') {
          sessionStorage.setItem('tocken', info.id) //d인자로 받는 토큰을 session storge 에 저장
          location.reload(true)
        }
        else {
          alert('Please check your ID or Password')
        }
      })
    }
  
    logout() {
      /* eslint no-restricted-globals:0 */
      sessionStorage.removeItem('tocken', 'tocken')
      location.reload(true)
    }
  
    isAuthenticated() { // eslint-disable-next-line
      return sessionStorage.getItem('tocken')//tocken 확인
    }
  }
  
  export default new Auth();
  