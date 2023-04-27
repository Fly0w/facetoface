import React from 'react';
import './FaceRecognition.css';

const FaceRecognition = ({ URL, box }) =>{
    return (
        <div className='divcolcenter'>
            <div className='previewImg'>
                <img id='inputImage' src={URL} alt=""/>
                <div 
                className='boundingBox' 
                style={{
                    top: box.topRow, 
                    right: box.rightCol, 
                    left: box.leftCol, 
                    bottom: box.bottomRow,
                    }}>
                </div> 
            </div>
        </div>
        
    )
}

export default FaceRecognition