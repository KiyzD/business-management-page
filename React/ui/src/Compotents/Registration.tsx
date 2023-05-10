import React, {ChangeEventHandler, MouseEventHandler} from 'react';
import {toast, ToastContainer} from "react-toastify";
import {useNavigate} from "react-router-dom";
import {Button, FormControl, InputLabel, MenuItem, Select, TextField} from "@mui/material";
import {PositionConsts} from "../helpers/position";

const Registration = () => {
    const navigate = useNavigate();
    const [form, setForm] = React.useState<any>({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        position: '',
    });

    const handleInputChange = (ev: any) => {
        setForm({
            ...form,
            [ev.target.name]: ev.target.value
        })
    };

    const handleOnClick = () => {
        fetch('http://127.0.0.1:3001/account/create_account', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({...form}),
        })
            .then((res) => res.json())
            .then((response) => {
                setForm({
                    email: '',
                    password: '',
                })
                if (response.message) {
                    toast.success(response.message);
                    setTimeout(() => {
                        navigate("/login")
                    }, 1500);
                } else {
                    toast.error("Cos poszlo nie tak!");
                }
            });
    };

    return (
        <div className={"login-div"}>
            <ToastContainer/>
            <TextField
                name={"firstName"}
                onChange={handleInputChange as any}
                required
                id="outlined-required"
                label="Imie"
                defaultValue=""
                fullWidth
            /><br/><br/>
            <TextField
                name={"lastName"}
                onChange={handleInputChange as any}
                required
                id="outlined-required"
                label="Naziwsko"
                defaultValue=""
                fullWidth
            />
            <br/><br/>
            <TextField
                name={"email"}
                onChange={handleInputChange as any}
                required
                id="outlined-required"
                label="Email"
                defaultValue=""
                fullWidth
            />
            <br/><br/>
            <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Pozycja</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    name={"position"}
                    value={form.position}
                    label="Pozycja"
                    onChange={handleInputChange}
                >
                    <MenuItem value={1}>{PositionConsts.kierownik}</MenuItem>
                    <MenuItem value={2}>{PositionConsts.pracownik}</MenuItem>
                </Select>
            </FormControl>
            <br/><br/>
            <TextField
                name={"password"}
                onChange={handleInputChange as any}
                required
                id="outlined-required"
                label="Haslo"
                type="password"
                defaultValue=""
                fullWidth
            />
            <br/><br/>
            <Button variant="contained" onClick={() => handleOnClick()}>Zarejestruj</Button>
        </div>
    );
};

export default Registration;