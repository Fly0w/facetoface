import React from 'react';
import Tilt from 'react-parallax-tilt';
import logoFace from '../../img/logo.png'

const Logo = () =>{
    return (
        <div className = "logotilt ma4 mt0">
            <Tilt perspective = "1000" tiltMaxAngleX='15' tiltMaxAngleY='15'>
                <div className = "image">
                    <img src={logoFace} alt="logo Face 2 Face" />
                    <p>Face 2 Face</p>
                </div>
            </Tilt>
        </div>
    )
}

export default Logo