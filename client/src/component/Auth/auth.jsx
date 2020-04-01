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
  
    isAuthenticated() {
      if(sessionStorage.getItem('session') == "login")
        return true;
      return false;
    }
  }
  
  export default new Auth();
  