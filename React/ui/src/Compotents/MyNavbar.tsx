import React, {useEffect, useState} from 'react';
import {Link, Route, Routes, useNavigate} from 'react-router-dom';
import LoginPage from "./LoginPage";
import MainPage from "./MainPage";
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
// @ts-ignore
import Icon from '../assets/icon.svg'
import {Nav} from 'react-bootstrap';
import Registration from "./Registration";
import {PositionMapper} from "../helpers/position";

export type User = {
    email: string | null;
    first_name: string | null;
    last_name: string | null;
    position: number | null;
    paycheck: number | null;
}

const MyNavbar = () => {
    const [user, setUser] = useState<User>({email: null, first_name: null, last_name: null, position: null, paycheck: null});
    const onLogin = (user: User) => {
        setUser(user);
    }
    return (
        <div>
            <Navbar bg="primary" variant="light">
                <Container>
                    <Navbar.Brand href="/">
                        <img
                            alt=""
                            src={Icon}
                            width="30"
                            height="30"
                            className="d-inline-block align-top"
                        />
                        Pocztex
                    </Navbar.Brand>
                    <Nav className="me-auto">
                        {!user.email ? <Nav.Link as={Link} to="/login">Login</Nav.Link> : <></>}
                        {!user.email ? <Nav.Link as={Link} to="/rejestracja">Rejestracja</Nav.Link> : <></>}
                    </Nav>
                </Container>
                <Navbar.Collapse className="justify-content-end">
                    <Navbar.Text>
                            <span className={"gold-text"} style={{cursor: 'pointer'}}>
                            {user.email ? (`Zalogowany jako: ${user.first_name} ${user.last_name}`) : 'Nie jestes zalogowany'}&nbsp;
                                <br/>{user.email ? `Twoje stanowisko to: ${PositionMapper(user.position!)}` : ''}
                            </span>
                    </Navbar.Text>
                </Navbar.Collapse>
            </Navbar>
            <Routes>
                <Route path="/login" element={<LoginPage onLogin={onLogin}/>}/>
                <Route path="/rejestracja" element={<Registration/>}/>
                <Route path="/" element={<MainPage user={user}/>}/>
            </Routes>
        </div>
    );
};

export default MyNavbar;