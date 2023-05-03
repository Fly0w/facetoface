import React, { Component } from 'react';
import ParticlesBg from 'particles-bg'
import Navigation from "./components/navigation/Navigation";
import Rank from "./components/rank/Rank";
import Logo from "./components/logo/Logo";
import ImageLinkForm from "./components/imageLinkForm/ImageLinkForm";
import FaceRecognition from './components/faceRecognition/FaceRecognition';
import SignIn from './components/signIn/SignIn';
import Register from './components/register/Register';
import UserPage from './components/userPage/UserPage';


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
  user : {
    id: "",
    name: "",
    email: "",
    entries: 0,
    joined: '',
    last_url:''
  }
};

class App extends Component {
  constructor() {
    super();
    this.state = state_init;
  }
 
  
//Fonction that loads the user informations in the state
  loadUser = (data) => {
    this.setState({user : {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined,
      last_url: data.last_url
    }})
  }

// Function returning the Face box location using coordinates, inside an object
  calculateFaceLocation = (data) =>{
    const imageBox = data.outputs[0].data.regions[0].region_info.bounding_box;
    
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);

    return {
      leftCol: imageBox.left_col * width,
      topRow: imageBox.top_row * height,
      rightCol: width - (imageBox.right_col * width),
      bottomRow: height - (imageBox.bottom_row * height)
    }
  }

// Function that displays the Face box
  displayFaceBox = (coordBox) => {
  this.setState ({box : coordBox});
  }

// Function returning the data from the API using our personal data, and updates database with new count and 
// new "last URL"
  returnClarifaiResponse = (image) => {
    //error display if the API returns a failed response (see below)
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
          this.displayFaceBox(this.calculateFaceLocation(response))
          this.callServerUpdateEntriesCount()
          this.callServerUpdateLastURL()
        }else {
          errorUrl.textContent = "URL is not valid, please try again" //error display
        }
      })
      .catch(err => console.log('error', err));

    return value;
  }
   
// Function that make a request to the server to update the entries count
  callServerUpdateEntriesCount= () =>{
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
  }

// Function that make a request to the server to update last loaded URL
  callServerUpdateLastURL= () =>{
    fetch("https://cryptic-springs-50153.herokuapp.com/imageupdate", {
      method: 'put',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
          id : this.state.user.id,
          last_url : this.state.imageUrl
      })
    })
      .then(response => response.json())
      .then(last_url => 
        this.setState(Object.assign(this.state.user, {last_url : last_url} ))) // updating last loaded url
  }





// Function setting the state URL and executing the function to get the data according to the url
  onSubmit = () => {
    this.setState({imageUrl: this.state.input}, () => this.returnClarifaiResponse(this.state.imageUrl));
  }

// Function setting the state for the input box
  onInputChange = (event) => {
    this.setState({input: event.target.value}, () => console.log(this.state.input))
  }

// Function changing the route of our app, and changing the initial state
  onRouteChange = (route) => {
    if(route === 'signin'){
      this.setState(state_init)
    }
    this.setState({route : route})
  }


  render() {
    const { imageUrl, box, route } = this.state;
    return (
      <div>
        <div className="toppage">
          <Logo />
          <Navigation route={route} onRouteChange={this.onRouteChange}/>
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
              : this.state.route === 'register'
                ? <Register onRouteChange={this.onRouteChange} loadUser={this.loadUser}/>
                : <UserPage 
                  onRouteChange={this.onRouteChange}
                  userInfo={this.state.user} />
        }
        <ParticlesBg type="custom" config={config} bg={true}/>
      </div>
  );
}
}

export default App;
