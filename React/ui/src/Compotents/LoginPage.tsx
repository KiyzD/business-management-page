import React from 'react';
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useNavigate} from 'react-router-dom';
import {User} from "./MyNavbar";
import {Button, TextField} from '@mui/material';

type LoginPageProps = {
    onLogin: (user: User) => void;
}

const LoginPage = (props: LoginPageProps) => {
    const navigate = useNavigate();
    const [form, setForm] = React.useState<any>({
        email: '',
        password: '',
    });

    const handleInputChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
        setForm({
            ...form,
            [ev.target.name]: ev.target.value
        })
    };


    const handleOnClick = () => {
        fetch('http://127.0.0.1:3001/account/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({...form}),
        })
            .then((res) => res.json())
            .then((response) => {
                props.onLogin(response.email)
                setForm({
                    email: '',
                    password: '',
                })
                props.onLogin(response);
                if (response.email) {
                    toast.success("Zalogowano pomyślnie!");
                    props.onLogin(response);
                    navigate("/")
                } else {
                    toast.error("Niepoprawny login lub hasło!");
                }
            });
    };

    return (
        <div className={"login-div"}>
            <ToastContainer/>
            <TextField
                required
                id="outlined-required"
                label="Email"
                defaultValue=""
                type={"email"}
                name={"email"}
                fullWidth
                onChange={handleInputChange}
            />
            <br/><br/>
            <TextField
                required
                id="outlined-required"
                label="Haslo"
                type={"password"}
                name={"password"}
                defaultValue=""
                fullWidth
                onChange={handleInputChange}
            />
            <br/><br/>
            <Button variant="contained" onClick={handleOnClick}>Zaloguj</Button>
        </div>
    );
};

export default LoginPage;