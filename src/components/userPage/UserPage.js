import React, { Component } from 'react';

class UserPage extends Component{
    constructor(userInfo) {
        super();
      }
   render(){
    const {userInfo} = this.props
        return (
        <div className='divcolcenter'>
            <h1>My Page</h1>
            <p className = "white f3 ">{`Name : ${userInfo.name}`}</p>
            <p className = "white f6 ">{userInfo.email}</p>
            <p className = "white f3 ">{`Joined : ${userInfo.joined}`}</p>
            <p className = "white f3 ">{`Total number of entries : ${userInfo.entries}`}</p>
            <div>
                <p className = "white f3 ">Last URL loaded :</p>
                {userInfo.last_url 
                    ? <div>
                        <p className = "white f5 ">{userInfo.last_url}</p>
                        <img width="300px" src={userInfo.last_url} alt="Last loaded"/>
                    </div>
                    : <p>No loaded URL yet</p>
            }  
            </div>
        </div>
    )
   }

}

export default UserPage