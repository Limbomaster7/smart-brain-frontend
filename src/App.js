import React from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation'
import Logo from './components/Logo/Logo'
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm'
import FaceRecognition from './components/FaceRecognition/FaceRecognition'
import Signin from './components/Signin/Signin'
import Register from './components/Register/Register'
import Rank from './components/Rank/Rank'
import Particles from 'react-particles-js';
import Clarifai from 'clarifai'


const app = new Clarifai.App({
  apiKey: "52d973dabb614c4a80934f91ce563a91"
})

const particlesOptions = {
  particles: {
    number: {
      value: 30,
      density: {
        enable: true,
        value_area: 800
      }
    },
      line_linked: {
        shadow: {
          enable: true,
          color: "#3ca9d1",
          blur: 5
        }
      
      },
      url: 'path/to/svg.svg'
  }
}

const initialState = {
  input: "",
  imageUrl: "",
  box: {},
  route: "signin",
  isSignedIn: false,
  user : {
    id:"",
    name: "",
    email: "",
    entries: 0,
    joined: ""
  }
}
class App extends React.Component {

  constructor() {
    super()
    this.state = initialState
  }

  loadUser = data => {
    this.setState({
      user: {
        id:data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined
      }
    })
  }


  calculateFaceLocation = (data) => {

    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box
    const image = document.getElementById("inputimage")
    const width = Number(image.width)
    const height = Number(image.height)

    return {
      leftCol: clarifaiFace.left_col * width ,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {

    this.setState({box: box})
    
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value})
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input})

    app.models
      .predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
      .then(response => this.displayFaceBox(this.calculateFaceLocation(response))
      .catch(err => console.log(err))
      )

    // app.models.initModel({id: Clarifai.COLOR_MODEL, version: "eeed0b6733a644cea07cf4c60f87ebb7"})
    // .then(generalModel => {
    //   return generalModel.predict("https://samples.clarifai.com/face-det.jpg")
    // }).then( response => {
    //   // var concepts = response['outputs'][0]['data']['concepts']

    //   // console.log(response)

    //   console.log(response)
    // })
  }
  
  onRouteChange = (route) => {

    if (route === "signout") {
      this.setState(initialState)
    } else if (route === 'home') {
      this.setState({isSignedIn: true})
    }
    this.setState({route: route})
  }

  render() {
    const {isSignedIn, imageUrl, route, box } = this.state
    return (
      <div className="App">
      <Particles className="particles" 
                  params={particlesOptions} />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
        { route === 'home' ? 

        <div>

        <Logo />
        
        
        
        <Rank name={this.state.user.name} entries={this.state.user.entries} />
        <ImageLinkForm onButtonSubmit={this.onButtonSubmit} onInputChange={this.onInputChange} />
        <FaceRecognition box={box} imageUrl={imageUrl} />
        </div>

        : (
          route === 'signin' 
          ? <Signin onRouteChange={this.onRouteChange} loadUser={this.loadUser} />  
          :  <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />  
        )
          
          
        
      }
      </div>
    
    );
  }
  
}

export default App;
