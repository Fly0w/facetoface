import React, { Component } from 'react';
import ParticlesBg from 'particles-bg'
import Navigation from "./components/navigation/Navigation";
import Rank from "./components/rank/Rank";
import Logo from "./components/logo/Logo";
import ImageLinkForm from "./components/imageLinkForm/ImageLinkForm";
import FaceRecognition from './components/faceRecognition/FaceRecognition';
import SignIn from './components/signIn/SignIn';
import Register from './components/register/Register';


//Particles BG settings
let config = {
  num: [20, 30],
  rps: 0.1,
  radius: 1.2,
  life: [5, 6],
  v:[0.2, 0.5],
  tha: [-90, 90],
  alpha: 0.3,
  // scale: [1, 0.1],
  position: "all", // all or center or {x:1,y:1,width:100,height:100}
  color: "#ffffff",
  cross: "dead", // cross or bround
  random: 1,  // or null,
  g: 0,    // gravity
  // f: [2, -1], // force
}

const state_init = {
  input: '',
  imageUrl: '',
  box:{},
  route: 'signin',
  isSignedIn: false,
  user : {
    id: "",
    name: "",
    email: "",
    entries: 0,
    joined: ''
  }
};

class App extends Component {
  constructor() {
    super();
    this.state = state_init;
  }
 
  
//For future use, loads the user informations in the state
  loadUser = (data) => {
    this.setState({user : {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }})
  }

// Function returning the Face box location using coordinates
  calculateFaceLocation = (data) =>{
    const imageBox = data.outputs[0].data.regions[0].region_info.bounding_box;
    
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);

    // console.log(width, height, imageBox)

    return {
      leftCol: imageBox.left_col * width,
      topRow: imageBox.top_row * height,
      rightCol: width - (imageBox.right_col * width),
      bottomRow: height - (imageBox.bottom_row * height)
    }
  }

// Function that displays the Face box
  displayFaceBox = (coordBox) => {
  this.setState ({box : coordBox}, () => console.log(this.state.box));
  }

// Function returning the data from the API using our personal data
  returnClarifaiResponse = (image) => {
    //error display
    const errorUrl = document.getElementById("errorUrl");
    errorUrl.textContent = "";

    const value = fetch("https://cryptic-springs-50153.herokuapp.com/imageurl",{
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
          imageurl : this.state.imageUrl
      })
    })
      .then(response => response.json())
      .then(response => {
        if (response.status.description === "Ok") { //If we get a valid response from the API
          fetch("https://cryptic-springs-50153.herokuapp.com/image", {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                id : this.state.user.id
            })
        })
          .then(response => response.json())
          .then(count => {
            this.setState(Object.assign(this.state.user, { entries : count }))
          })
          .catch(err => console.log(err))
          this.displayFaceBox(this.calculateFaceLocation(response))
        } else {
          errorUrl.textContent = "URL is not valid, please try again" //error display
        }
      })
      .catch(err => console.log('error', err));

    return value;
  }
   
// Function setting the state URL and executing the function to get the data according to the url
  onSubmit = () => {
    this.setState({imageUrl: this.state.input}, () => this.returnClarifaiResponse(this.state.imageUrl));
  }

// Function setting the state for the input box
  onInputChange = (event) => {
    this.setState({input: event.target.value}, () => console.log(this.state.input))
  }

  onRouteChange = (route) => {
    if (route === 'home'){
      this.setState({isSignedIn: true})
    } else if(route === 'signin') {
      this.setState(state_init)
    }
    this.setState({route:route})
  }


  render() {
    const { imageUrl, box, isSignedIn } = this.state;
    return (
      <div>
        <div className="toppage">
          <Logo />
          <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
        </div>

        {this.state.route === 'home'
          ? <div>
            <Rank name={this.state.user.name} entries={this.state.user.entries}/>
            <ImageLinkForm onInputChange={this.onInputChange} onSubmit={this.onSubmit}/>
            <p id="errorUrl" className='divcolcenter' style={{"color": "rgb(85, 0, 0)"}}></p>
            <FaceRecognition URL={imageUrl} box={box}/>        
          </div>
          : this.state.route === 'signin'
              ? <SignIn  onRouteChange={this.onRouteChange} loadUser={this.loadUser}/>
              : <Register onRouteChange={this.onRouteChange} loadUser={this.loadUser}/>
        }

        <ParticlesBg type="custom" config={config} bg={true}/>
      </div>
  );
}
}

export default App;
