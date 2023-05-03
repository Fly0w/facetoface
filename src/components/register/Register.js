import React, { Component } from 'react';

class Register extends Component {
    constructor(props) {
        super(props);
        this.state ={
            email : "",
            password : "",
            validPassword : false,
            validEmail : false,
            name : "",
        }
    }

    onNameChange = (event) => {
        this.setState({name: event.target.value})
    }

    emailCheck = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const emailValid = emailRegex.test(email);

        if (emailValid){
            this.setState({validEmail : true})
            console.log ("yes")
        } else {
            this.setState({validEmail : false})
            console.log ("no")
        }
    }

    onEmailChange = (event) => {
        const email = event.target.value
        this.setState({email: email })
        this.emailCheck(email)
    }

    passwordCheck = (password) => {
        const specialCharRegex = /[ !@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/;
        const numberRegex = /(?=.*?[0-9])/;
        const caseRegex = /^(?=.*[a-z])(?=.*[A-Z])/;

        const hasSpecialChar = specialCharRegex.test(password);
        const hasNumber = numberRegex.test(password);
        const hasCase = caseRegex.test(password);
        const isLongEnough = (password.length >= 6 && password.length <= 64);

        const spec = document.getElementById("passwordSpec");
        const numb = document.getElementById("passwordNumber");
        const casing = document.getElementById("passwordCase");
        const pwlength = document.getElementById("passwordLength");

        if (!hasSpecialChar){
            spec.style.color = "rgb(135, 0, 0)";
        }else{
            spec.style.color = "rgb(0, 135, 36)";
        }
        if (!hasNumber){
            numb.style.color = "rgb(135, 0, 0)";
        }else{
            numb.style.color = "rgb(0, 135, 36)";
        }
        if (!hasCase){
            casing.style.color = "rgb(135, 0, 0)";
        }else{
            casing.style.color = "rgb(0, 135, 36)";
        }
        if (password.length < 6 || password.length > 64){
            pwlength.style.color = "rgb(135, 0, 0)";
        }else {
            pwlength.style.color = "rgb(0, 135, 36)";
        }
        
        if (hasSpecialChar && hasNumber && hasCase && isLongEnough){
            this.setState({validPassword : true})
        } else {
            this.setState({validPassword : false})
        }
    }

    onPasswordChange = (event) => {
        const pswd = event.target.value;
        this.setState({password: pswd});
        this.passwordCheck(pswd);
    }

    onSubmitSignin = () => {
        if (this.state.validPassword && this.state.validEmail){
            fetch("https://cryptic-springs-50153.herokuapp.com/register", {
                method: 'post',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    name : this.state.name,
                    email : this.state.email,
                    password: this.state.password,
                })
            })
            .then(response => response.json())
            .then(user => {
                if (user.id) {
                    this.props.loadUser(user);
                    this.props.onRouteChange('home')
                }
            })
            .catch(console.log)
        } else {
            const text = document.getElementById("passwordNotValid");
            text.textContent = "Invalid Email or Password";
        }
    }

    
    handleKeyDown = (event) => {
        if (event.key === "Enter") {
          this.onSubmitSignin();
        }
      };



    render(){
        return (
            <main className="center signin pa4 black-80 shadow-3 divcolcenter">
                <div className="measure">
                    <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
                    <legend className="f1 fw6 ph0 mh0">Register</legend>

                    <div className="mt3">
                        <label className="db fw6 lh-copy f6" htmlFor="name">Name</label>
                        <input 
                        onKeyDown={this.handleKeyDown}
                        onChange= {this.onNameChange}
                        className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
                        autoComplete='username' 
                        type="text" 
                        name="name"  
                        id="name"/>
                    </div>
                    <div className="mv3">
                        <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
                        <input 
                        onKeyDown={this.handleKeyDown}
                        onChange= {this.onEmailChange}
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
                        onChange= {this.onPasswordChange}
                        className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
                        autoComplete='new-password' 
                        type="password" 
                        name="password"  
                        id="password"/>
                        <div className="passwordValid">
                            <label style={{
                                "text-align": "center",
                                "fontWeight": "bolder",
                                "marginTop" : "10px"
                                }}>Password Requirements</label>
                            <ul>
                                <li id='passwordSpec' style={{"color": "rgb(135, 0, 0)"}}>1 special character</li>
                                <li id='passwordNumber' style={{"color": "rgb(135, 0, 0)"}}>1 number</li>
                                <li id='passwordCase' style={{"color": "rgb(135, 0, 0)"}}>1 lowercase and 1 uppercase </li>
                                <li id='passwordLength' style={{"color": "rgb(135, 0, 0)"}}>Length between 6 and 64 caracters </li>
                            </ul>
                        </div>
                        
                    </div>

                    </fieldset>
                    <div className="">
                        <input 
                        onClick={this.onSubmitSignin}
                        className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" 
                        type="submit" 
                        value="Register"
                        />
                        <p id="passwordNotValid" style={{
                                "text-align": "center",
                                "fontWeight": "bold"
                                }}></p>
                    </div>
                </div>
        </main>
        )
}
}

export default Register