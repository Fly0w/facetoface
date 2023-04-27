import React from 'react';

const Navigation = ({onRouteChange, isSignedIn}) =>{
    if (isSignedIn){
        return (
        <nav>
            <p onClick={() => onRouteChange('signin')} className='f3 link dim white underline pa3 pointer'>Sign Out</p>
        </nav> )
    } else{
        return (
            <div>
                <p onClick={() => onRouteChange('signin')} className='f3 link dim white underline pa3 pointer'>Login</p>
                <p onClick={() => onRouteChange('register')} className='f3 link dim white underline pa3 pointer'>Register</p>
            </div>
        )
    }
}

export default Navigation