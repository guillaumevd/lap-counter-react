import { useState } from "react";
import axios from "axios";
import './style.css'
const AuthPage = (props) => {
  const [message, setMessage] = useState();
  const [register, setMode] = useState(false);
  const [username, setUsername] = useState();
  const [password, setpassword] = useState();
  const [email, setEmail] = useState();
  const [first_name, setFirstName] = useState();
  const [last_name, setLastName] = useState();

  const onLogin = (e) => {
    e.preventDefault();
    axios
      .post("http://146.59.227.84:3001/login", { 
        username, 
        password 
      })
      .then((r) => {
        const user = r.data;
        props.onAuth(user);
        localStorage.setItem('user', JSON.stringify(user));
      }) // NOTE: over-ride password
      .catch((e) => setMessage(e.response.data.message));
  };

  const onSignup = (e) => {
    e.preventDefault();
    axios
      .post("http://146.59.227.84:3001/register", {
        username,
        password,
        email,
        first_name,
        last_name,
      })
      .then((r) => {
        const user = r.data;
        props.onAuth(user);
        localStorage.setItem('user', JSON.stringify(user));
      }) // NOTE: over-ride password
      .catch((e) => setMessage(e.response.data.message));
  };
  if (register) {
    return (
      <div style={{ height: "100%", width: "100%" }}>
        <div class="login-box">
          <h2>S'inscrire - Pears</h2>
          <form onSubmit={onSignup} id="form" >
            <div class="user-box">
              <input type="text" onChange={(e) => setUsername(e.target.value)}></input>
              <label>Nom d'utilisateur</label>
            </div>
            <div class="user-box">
              <input type="text" onChange={(e) => setEmail(e.target.value)}></input>
              <label>Adresse email</label>
            </div>
            <div class="user-box">
              <input type="text" onChange={(e) => setFirstName(e.target.value)}></input>
              <label>Prénom</label>
            </div>
            <div class="user-box">
              <input type="text" onChange={(e) => setLastName(e.target.value)}></input>
              <label>Nom de famille</label>
            </div>
            <div class="user-box">
              <input type="password" onChange={(e) => setpassword(e.target.value)}></input>
              <label>Mot de passe</label>
            </div>
            <span>{ message }</span>
            <button className="button-23" type="submit">
              S'inscrire
            </button>
            <button className="button-23" onClick={ () => setMode(false) }>
              Se connecter
            </button>
          </form>
        </div>
      </div>
      
    );
  } else {
    return (
      <div style={{ height: "100%", width: "100%" }}>
        <div class="login-box">
          <h2>Se connecter - Pears</h2>
          <form onSubmit={onLogin} id="form" >
            <div class="user-box">
              <input type="text" onChange={(e) => setUsername(e.target.value)}></input>
              <label>Nom d'utilisateur</label>
            </div>
            <div class="user-box">
              <input type="password" onChange={(e) => setpassword(e.target.value)}></input>
              <label>Mot de passe</label>
            </div>
            <span>{ message }</span>
            <button className="button-23" type="submit">
              Se connecter
            </button>
            <button className="button-23" onClick={ () => setMode(true) }>
              S'inscrire
            </button>
          </form>
        </div>
      </div>
    );
  }
};

export default AuthPage;
