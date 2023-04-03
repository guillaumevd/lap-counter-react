import { useState } from "react";
import './style.css'

const Home = (props) => {
  const user = props.user;  

  return (
    <h1>Hello {user.first_name}</h1>
  );
};

export default Home;
