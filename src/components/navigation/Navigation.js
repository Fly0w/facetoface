import React from 'react';

const Navigation = ({onRouteChange, route}) =>{
    if (route === 'home'){
        return (
        <nav>
            <p onClick={() => onRouteChange('userPage')} className='f3 link dim white underline pa3 pointer'>My page</p>
            <p onClick={() => onRouteChange('signin')} className='f3 link dim white underline pa3 pointer'>Sign Out</p>
        </nav> )
    } else if (route === 'userPage'){
        return (
        <nav>
            <p onClick={() => onRouteChange('home')} className='f3 link dim white underline pa3 pointer'>Home</p>
            <p onClick={() => onRouteChange('signin')} className='f3 link dim white underline pa3 pointer'>Sign Out</p>
        </nav> )
    } else if (route === 'signin' || route === 'register' || route === 'forgot_password'){
        return (
            <div>
                <p onClick={() => onRouteChange('signin')} className='f3 link dim white underline pa3 pointer'>Login</p>
                <p onClick={() => onRouteChange('register')} className='f3 link dim white underline pa3 pointer'>Register</p>
            </div>
        )
    }
}

export default Navigation