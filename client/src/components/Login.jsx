import {useState, useRef} from "react"
import RoomSharpIcon from '@material-ui/icons/RoomSharp';
import {Cancel} from '@material-ui/icons'
import axios from "axios";
import "./login.css"

export default function Login({setShowLogin, myStorage, setCurrentUser}){
    const [error, setError] = useState(false)
    const emailRef = useRef()
    const passwordRef = useRef()
    const handleSubmit = async(e) => {
        e.preventDefault();
        const user = {
            email: emailRef.current.value,
            password: passwordRef.current.value,

        };
        try{
            const res = await axios.post("http://localhost:8000/api/users/login", user)
            myStorage.setItem("user", res.data.username)
            setCurrentUser(res.data.username)
            setShowLogin(false);
            setError(false);
        }catch(err){
            setError(true)
        }

    }

    return (
        <div className="loginContainer">
        <div className="logo">
            <RoomSharpIcon />
            LocoLocation
        </div>
        <form onSubmit={handleSubmit}>
            <input type="text" placeholder="email" ref={emailRef} />
            <input type="password" placeholder="password" ref={passwordRef} />
            <button className="loginBtn">Login</button>
            
            {error && <span className="failed">Something went wrong!</span>}
        </form>
    <Cancel className="loginCancel" onClick={() => setShowLogin(false)} />
    </div>
    )
}