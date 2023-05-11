import React, { Component } from 'react';

class ForgotPassword extends Component {
    constructor(props) {
        super(props);
        this.state ={
            ResetPasswordEmail : "",
        }
    }

// Updates the "ResetPasswordEmail" state of this component when typing
    onEmailChange = (event) => {
        this.setState({ResetPasswordEmail: event.target.value})
    }

// Function that sends a request to the server with the email that the user has written 
// in the body. If the user's email exists, i.e if we get a positive response from the 
// server, the serv will take care of sending an email to the new password creation. 
// If the user doesn't exists, dispays an error message
    onSubmitForgotPassword = () => {
        const infoEmail = document.getElementById("invalidEmail");
        infoEmail.textContent="";

        const sentEmail = document.getElementById("sentEmail");
        sentEmail.textContent="";

        // "https://cryptic-springs-50153.herokuapp.com/forgotPassword"
        // "http://localhost:3001/forgotPassword"
        
        fetch("https://cryptic-springs-50153.herokuapp.com/forgotPassword", {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                email : this.state.ResetPasswordEmail,
            })
        })
            .then(response => response.json())
            .then(response => {
                if (response === "User Exists") {
                    infoEmail.textContent=`An email has been sent to`
                    sentEmail.textContent= this.state.ResetPasswordEmail;
                } else {
                    infoEmail.textContent="This Email does not exist"
                }
            })
            .catch(console.log)
    }

// Enables sending the form by pressing Enter
    handleKeyDown = (event) => {
        if (event.key === "Enter") {
          this.onSubmitSignin();
        }
      };

    render(){
        return (
            <main className="center signin pa4 black-80 shadow-3 divcolcenter">
                <p className="f3 i b dark-red">This feature is not supported in deployed app because it need an organizational email sender</p>
                <div className="measure">
                    <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
                    <legend className="f2 fw6 ph0 mh0">Forgot Password</legend>
                    <div className="mt3">
                        <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
                        <input 
                        onKeyDown={this.handleKeyDown}
                        onChange={this.onEmailChange}
                        className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
                        autoComplete='username' 
                        type="email" 
                        name="email-address"  
                        id="email-address"/>
                        <p  id="invalidEmail"></p>
                        <p className="f6" id="sentEmail"></p>
                    </div>
                    </fieldset>
                    <div className="">
                        <input 
                        onClick={this.onSubmitForgotPassword}
                        className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" 
                        type="submit" 
                        value="Reset Password"
                        />
                    </div>
                    
                </div>
        </main>
        )
    }
}

export default ForgotPassword