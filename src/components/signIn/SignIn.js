import React, { Component } from 'react';

class SignIn extends Component {
    constructor(props) {
        super(props);
        this.state ={
            signInEmail : "",
            signInPassword : ""
        }
    }

// Updates the "signInEmail" state of this component when typing
    onEmailChange = (event) => {
        this.setState({signInEmail: event.target.value})
    }
// Updates the "signInPassword" state of this component when typing
    onPasswordChange = (event) => {
        this.setState({signInPassword: event.target.value})
    }

// Function that sends a request to the server with the credentials that the user has written.
// If the response is positive, i.e if we get a user object (supposingly having an "id"),
// then it loads the user's information in the App.js state, and redirect to the home page
// Displays an error message in case of bad credentials
    onSubmitSignin = () => {
        const errorLogin = document.getElementById("errorLogin");
        errorLogin.textContent="";

        fetch("https://cryptic-springs-50153.herokuapp.com/signin", {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                email : this.state.signInEmail,
                password: this.state.signInPassword
            })
        })
            .then(response => response.json())
            .then(user => {
                if (user.id) {
                    this.props.loadUser(user);
                    this.props.onRouteChange('home')
                } else {
                    errorLogin.textContent="Wrong credentials"
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
        const { onRouteChange } = this.props;
        return (
            <main className="center signin pa4 black-80 shadow-3 divcolcenter">
                <div className="measure">
                    <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
                    <legend className="f1 fw6 ph0 mh0">Sign In</legend>
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
                    </div>
                    <div className="mv3">
                        <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
                        <input 
                        onKeyDown={this.handleKeyDown}
                        onChange={this.onPasswordChange}
                        className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
                        autoComplete='current-password' 
                        type="password" 
                        name="password"  
                        id="password"/>
                    </div>
                    <p id="errorLogin" style={{"color": "rgb(135, 0, 0)"}}></p>
                    </fieldset>
                    <div className="">
                        <input 
                        onClick={() => this.onSubmitSignin()}
                        className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" 
                        type="submit" 
                        value="Sign in"
                        />
                    </div>
                    <div className="lh-copy mt3">
                        <a onClick={() => onRouteChange('register')} href="#0" className="f6 link dim black db pointer">Register</a>
                    </div>
                    <div style={{"margin-top" : "15px"}}>
                        <a onClick={() => onRouteChange('forgot_password')} href="#0" className="f6 link dim black db pointer">I forgot my password</a>
                    </div>
                    
                </div>
        </main>
        )
    }
}

export default SignIn