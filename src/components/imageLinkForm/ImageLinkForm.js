import React from 'react';

const ImageLinkForm = ({ onInputChange, onSubmit }) =>{
    return (
        <div className='divcolcenter'>
            <p className='f3 navy'>
                {'This Magic Brain detects faces in your pictures. Give it a try !'}
            </p>
            <div className='pa4 br3 shadow-1'>
                <input className='f4 pa2 w-70 center' type="text" onChange={onInputChange}/>
                <button className='w-30 grow f4 link ph3 pv2 dib white bg-light-purple' onClick={onSubmit}>Detect</button>
            </div>
        </div>

    )
}

export default ImageLinkForm;