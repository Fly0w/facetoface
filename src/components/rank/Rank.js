import React from 'react';

const Rank = ({ name, entries }) =>{
    return (
        <div className='divcolcenter'>
            <div className = "white f3 ">
                {`${name}, your number of entries is : `}
            </div>
            <div className = "white f2">
                {entries}
            </div>
        </div>
    )
}

export default Rank