import React from 'react';

const ImageLinkForm = ({ onInputChange, onSubmit }) =>{
    
// Allows submiting when pressing Enter
    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
          onSubmit();
        }
      };

    return (
        <div className='divcolcenter'>
            <ol className='f3 light-gray'>
                <li>{'Select a picture with a face in it'}</li>
                <li>{'Copy and paste the URL below'}</li>
                <li>{'See what will happen !'}</li>
            </ol>
            <div className='pa4 br3 shadow-1'>
                <input 
                onKeyDown={handleKeyDown}
                placeholder='Insert image URL'
                className='f4 pa2 w-70 center' 
                type="text" 
                onChange={onInputChange}/>
                <button className='w-30 grow f4 link ph3 pv2 dib white bg-light-purple' onClick={onSubmit}>Detect</button>
            </div>
        </div>

    )
}

export default ImageLinkForm;