import React, { Component } from 'react';

class UserPage extends Component{
    constructor(userInfo, loadUser) {
        super();
        this.state = {
            input_name : "",
        }
      }

// Updates the "input_name" state of this component when typing
    onInputNameChange = (event) => {
        this.setState({input_name: event.target.value}, () => console.log(this.state.input_name))
    }

// Function that takes a new name in parameter. Then, sends a request to the server with 
// the id of the connected user, with a new name. The server returns the user's new object
// with updated name.
    updateName = (newName) => {
        fetch("https://cryptic-springs-50153.herokuapp.com/changeName", {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                id : this.props.userInfo.id,
                new_name : newName
            })
        })
        .then(response => response.json())
        .then(user => 
            this.props.loadUser(user))
        .catch(err => console.log(err, "Error while changing the name"))
        }

// Enables sending a form by pressing Enter  
    handleKeyDown = (event) => {
        if (event.key === "Enter") {
            this.updateName();
        }
    };

   render(){
    const { userInfo } = this.props
        return (
        <div className='userInfo'>
            <h1>My Page</h1>
            <p className = "white f3 ">{`Name : ${userInfo.name}`}</p>
            <div className='nameChange'>
                <input 
                    onKeyDown={this.handleKeyDown}
                    onChange= {this.onInputNameChange}
                    className="pa2 input-reset ba bg-washed-blue hover-bg-black hover-white w-100" 
                    autoComplete='' 
                    type="text" 
                    name="new_name"  
                    id="new_name"
                    placeholder='Change name'/>
                <button 
                    onClick= {() => this.updateName(this.state.input_name)}
                >Change name
                </button>
            </div>
            <p className = "white f6 ">{userInfo.email}</p>
            <p className = "white f3 ">{`Joined : ${userInfo.joined.slice(0,10)}`}</p>
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