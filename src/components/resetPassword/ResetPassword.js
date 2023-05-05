import React, { Component } from 'react';

class ResetPassword extends Component {
    constructor(props) {
        super(props);
        this.state ={
            email: "",
            token:"",
            password1 : "",
            password2 : "",
            validPasswords : false,
        }
    }

//Function that reads the URL and extract the email adress
    getEmailAdress = () => {
        const url = window.location.href; // Get URL
        const parts = url.split("/"); // Split URL with "/"
        const emailPart = parts.find(part => part.includes("email=")); // Finds the part with "email="
        if (emailPart) { // If the right part has been found
          const email = emailPart.substring(6); // Gets the string containing the email, after position 6, which corresponds to the length of the string "email="
          this.setState({email : email})
        }
    }

    getToken = () => {
        const url = window.location.href; // Get URL
        const parts = url.split("/"); // Split URL with "/"
        const tokenPart = parts.find(part => part.includes("token=")); // Finds the part with "token="
        if (tokenPart) { // If the right part has been found
          const token = tokenPart.substring(6); // Gets the string containing the token, after position 6, which corresponds to the length of the string "token="
          this.setState({token : token})
        }
    }



// Get email adress from the URL
    componentDidMount = () => {
        this.getEmailAdress();
        this.getToken()
    }

// Updates the "password1" state of this component when typing and checks if the passwords are valid
    onPasswordChange1 = (event) => {
        const pswd = event.target.value;
        this.setState({password1: pswd}, () => this.passwordCheck());

    }
// Updates the "password2" state of this component when typing and checks if the passwords are valid
    onPasswordChange2 = (event) => {
        const pswd = event.target.value;
        this.setState({password2: pswd}, () => this.passwordCheck());
    }

// Function that checks if the password in parameter satisfies the conditions for a
// password, i.e having at least 1 special character, 1 number, 1 lower and upper case 
// character and having a length between 6 and 64 characters in it. 
// Changes the states "validpassword" to true if OK.
// Also takes care of displaying in real time if the conditions are respected
    passwordCheck = () => {
        const password1 = this.state.password1;
        const password2 = this.state.password2;

        const specialCharRegex = /[ !@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/;
        const numberRegex = /(?=.*?[0-9])/;
        const caseRegex = /^(?=.*[a-z])(?=.*[A-Z])/;

        const hasSpecialChar1 = specialCharRegex.test(password1);
        const hasNumber1 = numberRegex.test(password1);
        const hasCase1 = caseRegex.test(password1);
        const isLongEnough1 = (password1.length >= 6 && password1.length <= 64);
        const passwordMatch = password1===password2;

        const spec = document.getElementById("passwordSpec");
        const numb = document.getElementById("passwordNumber");
        const casing = document.getElementById("passwordCase");
        const pwlength = document.getElementById("passwordLength");
        const pwsame = document.getElementById("passwordIdentical");

        if (!hasSpecialChar1){
            spec.style.color = "rgb(135, 0, 0)";
        }else{
            spec.style.color = "rgb(0, 135, 36)";
        }
        if (!hasNumber1){
            numb.style.color = "rgb(135, 0, 0)";
        }else{
            numb.style.color = "rgb(0, 135, 36)";
        }
        if (!hasCase1){
            casing.style.color = "rgb(135, 0, 0)";
        }else{
            casing.style.color = "rgb(0, 135, 36)";
        }
        if (password1.length < 6 || password1.length > 64){
            pwlength.style.color = "rgb(135, 0, 0)";
        }else {
            pwlength.style.color = "rgb(0, 135, 36)";
        }
        if (!passwordMatch || password1.length === 0){
            pwsame.style.color = "rgb(135, 0, 0)"
        } else {
            pwsame.style.color = "rgb(0, 135, 36)"
        }


        if (hasSpecialChar1 && hasNumber1 && hasCase1 && isLongEnough1 && passwordMatch){
            this.setState({validPasswords : true})
        } else {
            this.setState({validPasswords : false})
        }
    }


// Function that sends a request to the server with the new password and the email of our user.
// If the password is successfully changed, redirect to the sign in page.
    onSubmitChangePassword = () => {
        const text = document.getElementById("passwordNotValid");
        text.textContent = "";

        const email = this.state.email;
        const token = this.state.token;

        if (this.state.validPasswords){
            fetch(`https://cryptic-springs-50153.herokuapp.com/resetPassword/${email}/${token}`, {
                method: 'put',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    password: this.state.password1,
                })
            })
            .then(response => response.json())
            .then(response => {
                if (response === "Password changed Successfully") {
                    window.location.assign('https://fly0w.github.io/facetoface/');
                } else {
                    text.textContent = "Error";
                }
            })
            .catch(err => console.log("Server error"))
        } else {
            text.textContent = "Invalid Password";
        }
    }

// Enables sending the form by pressing Enter
    handleKeyDown = (event) => {
        if (event.key === "Enter") {
          this.onSubmitChangePassword();
        }
      };

    render(){
        return (
            <main className="center signin pa4 black-80 shadow-3 divcolcenter">
                <div className="measure">
                    <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
                    <legend className="f1 fw6 ph0 mh0">Change Password</legend>
                    <div className="mv3">
                        <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
                        <input 
                        onKeyDown={this.handleKeyDown}
                        onChange= {this.onPasswordChange1}
                        className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
                        autoComplete='new-password' 
                        type="password" 
                        name="password"  
                        id="password1"/>
                        <label className="db fw6 lh-copy f6" htmlFor="password">Confirm password</label>
                        <input 
                        onKeyDown={this.handleKeyDown}
                        onChange= {this.onPasswordChange2}
                        className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
                        autoComplete='new-password' 
                        type="password" 
                        name="password"  
                        id="password2"/>
                        <div className="passwordValid">
                            <label style={{
                                "textAlign": "center",
                                "fontWeight": "bolder",
                                "marginTop" : "10px"
                                }}>Password Requirements</label>
                            <ul>
                                <li id='passwordSpec' style={{"color": "rgb(135, 0, 0)"}}>1 Special character</li>
                                <li id='passwordNumber' style={{"color": "rgb(135, 0, 0)"}}>1 Number</li>
                                <li id='passwordCase' style={{"color": "rgb(135, 0, 0)"}}>1 Lowercase and 1 uppercase </li>
                                <li id='passwordLength' style={{"color": "rgb(135, 0, 0)"}}>Length between 6 and 64 characters </li>
                                <li id='passwordIdentical' style={{"color": "rgb(135, 0, 0)"}}>Passwords must match </li>
                            </ul>
                        </div>
                    </div>

                    </fieldset>
                    <div className="">
                        <input 
                        onClick={this.onSubmitChangePassword}
                        className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" 
                        type="submit" 
                        value="Register"
                        />
                        <p id="passwordNotValid" style={{
                                "textAlign": "center",
                                "fontWeight": "bold"
                                }}></p>
                    </div>
                </div>
        </main>
        )
    }
}

export default ResetPassword