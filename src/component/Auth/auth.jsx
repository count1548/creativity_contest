class Auth {
    constructor() {
       this.authenticated = false;
    }
  
    login(cb = () => {}) {
      sessionStorage.setItem('session', 'login');
      cb()
    }
  
    logout(cb = () => {}) {
      sessionStorage.removeItem('session');
      cb();
    }
  
    isAuthenticated() { // eslint-disable-next-line
      if(sessionStorage.getItem('session') == "login")
        return true;
      return false;
    }
  }
  
  export default new Auth();
  