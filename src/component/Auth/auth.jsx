const host = "http://uck.myds.me:3001"

class Auth {  
    login(info) {
      fetch(`${host}/auth/login/`, {
        method: 'POST',
        headers:{
          'Content-Type': 'application/json'
        },
        body : JSON.stringify({
            'sid' : info.id, 
            'pwd' : info.pwd,
        })
      }).then(res => res.json())
      .then(res => {
        if(res.message === 'login success') {
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
      return sessionStorage.getItem('tocken') === 'root'//tocken 확인
    }
  }
  
  export default new Auth();
  