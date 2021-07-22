import {useState, useEffect} from 'react';
import axios from 'axios';
import ReactMapGL, {Marker, Popup} from 'react-map-gl'
import RoomSharpIcon from '@material-ui/icons/RoomSharp';
import StarIcon from '@material-ui/icons/Star';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import {format} from 'timeago.js';

import Register from './components/Register';
import Login from './components/Login';
import "./App.css";

function App(){
  const myStorage = window.localStorage;

  const [currentUser, setCurrentUser] = useState(myStorage.getItem("user"));
  const [pins, setPins] = useState([])
  const [currentPlaceId, setCurrentPlaceId] = useState(null)
  const [newPlace, setNewPlace] = useState(null)
  const [title, setTitle] = useState(null)
  const [desc, setDesc] = useState(null)
  const [rating, setRating] = useState(0)
  const [showRegister, setShowRegister] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [likes, setLikes] = useState(0)
  const [liked, setLiked] = useState(false);



  const [viewport, setViewport] = useState({
    width: "100vw",
    height: "100vh",
    latitude: 6.5244,
    longitude: 3.3782,
    zoom: 9,
  });


  useEffect(() => {
      const getPins = async () => {
        try{
          const res = await axios.get('http://localhost:8000/api/pins')
          setPins(res.data);

        }catch(err){
          console.log(err)
        }
      }
      getPins()
  }, [])

  const handleMarkerClick = (id, lat, long) => {
    setCurrentPlaceId(id);
    setViewport({...viewport, latitude: lat, longitude : long});
  }

  const handleAddClick = (e) => {
    const [longitude, latitude] = e.lngLat;
    setNewPlace({
      latitude,
      longitude
    })
}

  const handleSubmit = async (e) => {
    e.preventDefault();
    //saves newLocation value
    const newLocation = {
      username: currentUser,
      title,
      description: desc,
      rating,
      latitude: newPlace.latitude,
      longitude: newPlace.longitude
      
    }
    try{
      const res = await axios.post("http://localhost:8000/api/pins", newLocation)
      setPins([...pins, res.data]);
      setNewPlace(null);

    }catch(err){
      console.log(err)
    }
  }


  const handleLogout = () => {
    myStorage.removeItem("user");
    setCurrentUser(null)
  }

  const likeHandler = async (id) => {
    if(currentUser){
    const user = {
      username: currentUser
    }
      try{
        await axios.put(`http://localhost:8000/api/pins/${id}/like`, user)
      }catch(e){
        console.log(e);
      }
    setLiked(!liked)
    setLikes(liked ? likes - 1 : likes + 1)
    
    }else{
      alert("You must be logged in to like")
    }

  
  }


  

  return (
    <div className="App">
     <ReactMapGL {...viewport}
     mapboxApiAccessToken={process.env.REACT_APP_MAPBOX}
     onViewportChange={nextViewport => setViewport(nextViewport)}
     mapStyle="mapbox://styles/michaelkwanzaa/ckql7m54o1myx17nv4r2c9opj"
     onDblClick = {handleAddClick}
     >
       {pins.map(p => (
         <>
        
        <Marker
        latitude={p.latitude}
        longitude={p.longitude}
        offsetLeft={-viewport.zoom}
        offsetTop={-viewport.zoom * 2.5}>
          <RoomSharpIcon 
          style={{fontSize:viewport.zoom * 2.5, color: p.username===currentUser ? "#420420" : "slateblue", cursor: "pointer"}}
          onClick={() => handleMarkerClick(p._id, p.latitude, p.longitude)}
          />
        </Marker>
        {p._id === currentPlaceId && (
        <Popup
          latitude={p.latitude} 
          longitude={p.longitude}
          closeButton={true}
          closeOnClick={false}
          anchor="left"
          onClose={() => setCurrentPlaceId(null)}
        >
          <div className="card">
            <label>Place</label>
            <h4 className="place">{p.title}</h4>
            <label>Review</label>
            <p>{p.description}</p>
            <label>Rating</label>
            <div className="stars">
              {/* Gets ratings, and adds a new staricon depending on number*/}
              {Array(p.rating).fill(<StarIcon className="star" />)}
            </div>
            <label>Information</label>
            <span className="username">Created by <b>{p.username}</b></span>
            <span className="date">{format(p.createdAt)}</span>
            <div class="likes-and-dislikes-class">
            {likes}<ThumbUpIcon className="thumbs up" onClick={() => likeHandler(p._id)} />
            </div>
            
          </div>
        </Popup> 
        )}
        </> 
       ))}
       {newPlace && (<Popup 
        latitude={newPlace.latitude}
        longitude={newPlace.longitude}
        closeButton={true}
        closeOnClick={false}
        anchor="left"
        onClose={() => setNewPlace(null)}
        >
          {/* Form control, for adding new pins/locations*/}
          <div>
            <form onSubmit={handleSubmit}>
              <label>Title</label>
              <input placeholder="enter title..." onChange={(e) => setTitle(e.target.value)} />
              <label>Review</label>
              <textarea placeholder="your views on this place..." onChange={(e) => setDesc(e.target.value)} />
              <label>Rating</label>
              <select onChange={(e) => setRating(e.target.value)}>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
              <button className="submitButton" type="submit">Add Loco</button>
            </form>
          </div>
        </Popup>
       )}

      {/* Login/Register/Logout functionality */}
      {/* Shows logout button if current user is set to a value else, shows login/register*/}
      {currentUser ? (<button className="button logout" onClick={handleLogout}>Log out</button>) :
      (<div className="buttons">
        <button className="button login"
        onClick={() => setShowLogin(true)}>Login</button>

        <button className="button register" 
        onClick={() => setShowRegister(true)}>Register</button>
       </div>)}

       {/* Pop up windows for login/register functionality*/}
      {showRegister &&
      <Register setShowRegister={setShowRegister} />
      }

      {showLogin && 
      <Login setShowLogin={setShowLogin}
      myStorage={myStorage} 
      setCurrentUser={setCurrentUser}
      />}
     </ReactMapGL>
    </div>
  );
}

export default App;
