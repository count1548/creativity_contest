import auth from '../Auth/auth';
import React from 'react';

const logout = ({history}) => {
    auth.logout(history.push('/'))
    return (
        <div></div>
    )
}
export default logout;