import React, { useState } from "react";
import { redirect } from "react-router-dom";
import { NavLink } from "react-router-dom";

//All the svg files
import Home from "../assets/home-solid.svg";
import Timing from "../assets/timing.svg";
import Settings from "../assets/settings.svg";
import News from "../assets/news.svg";
import styled from "styled-components";

const Container = styled.div`
  position: fixed;

  .active {
    border-right: 4px solid var(--white);

    img {
      filter: invert(100%) sepia(0%) saturate(0%) hue-rotate(93deg)
        brightness(103%) contrast(103%);
    }
  }
`;

const SidebarContainer = styled.div`
  background-color: var(--black);
  width: 3.5rem;
  height: 50vh;
  margin-top: 1rem;
  border-radius: 0 30px 30px 0;
  padding: 1rem 0;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;

  position: relative;
`;


const SlickBar = styled.ul`
  color: var(--white);
  list-style: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: var(--black);

  padding: 2rem 0;

  position: absolute;
  top: 6rem;
  left: 0;

  width: ${(props) => (props.clicked ? "12rem" : "3.5rem")};
  transition: all 0.5s ease;
  border-radius: 0 30px 30px 0;
`;

const Item = styled(NavLink)`
  text-decoration: none;
  color: var(--white);
  width: 100%;
  padding: 1rem 0;
  cursor: pointer;

  display: flex;
  padding-left: 1rem;

  &:hover {
    border-right: 4px solid var(--white);

    img {
      filter: invert(100%) sepia(0%) saturate(0%) hue-rotate(93deg)
        brightness(103%) contrast(103%);
    }
  }

  img {
    width: 1.2rem;
    height: auto;
    filter: invert(92%) sepia(4%) saturate(1033%) hue-rotate(169deg)
      brightness(78%) contrast(85%);
  }
`;

const Profile = styled.div`
  width: 3rem;
  height: 3rem;

  padding: 0.5rem 1rem;
  /* border: 2px solid var(--white); */
  border-radius: 20px;

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: var(--black);
  color: var(--white);

  img {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    cursor: pointer;

    &:hover {
      border: 2px solid var(--grey);
      padding: 2px;
    }
  }
`;


const Sidebar = (props) => {
  const [click, setClick] = useState(false);
  return (
    <Container>
      <SidebarContainer>
        <SlickBar clicked={click}>
          <Item
            onClick={() => setClick(false)}
            exact="true"
            to="/"
          >
            <img src={Home} alt="Home" />
          </Item>
          <Item
            onClick={() => setClick(false)}
            to="/timing"
          >
            <img src={Timing} alt="Timing" />
          </Item>
          <Item
            onClick={() => setClick(false)}
            to="/news"
          >
            <img src={News} alt="News" />
          </Item>
          <Item
            onClick={() => setClick(false)}
            to="/settings"
          >
            <img src={Settings} alt="Settings" />
          </Item>
        </SlickBar>

        <Profile>
          <img
            src="https://picsum.photos/200"
            alt="Profile"
            onClick={ () => redirect('/profile') }
          />
        </Profile>
      </SidebarContainer>
    </Container>
  );
};

export default Sidebar;
