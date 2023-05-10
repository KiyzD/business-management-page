import React, {useEffect} from 'react';
import {User} from "./MyNavbar";
import {PositionMapper} from "../helpers/position";
import {toast} from "react-toastify";
import {
    Button,
    Paper,
    styled,
    Table,
    TableBody,
    TableCell,
    tableCellClasses,
    TableContainer,
    TableHead,
    TableRow,
    TextField
} from '@mui/material';

const StyledTableCell = styled(TableCell)(({theme}) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({theme}) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

type MainPageProps = {
    user: User
}
type Task = {
    id: number,
    content: string,
    reserved_by: string,
    is_done: boolean,
    cost: number,
}
type UserAccount = {
    email: string,
    first_name: string,
    last_name: string,
    paycheck: number,
}
const MainPage = (props: MainPageProps) => {
    const [data, setData] = React.useState<Task[]>([]);
    const [form, setForm] = React.useState({
        content: '',
        cost: 0,
    });
    const [allUsers, setAllUsers] = React.useState<UserAccount[]>([]);
    useEffect(() => {
        fetch('http://127.0.0.1:3001/task/get_tasks', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((res) => res.json())
            .then((response) => {
                setData(response);
            });

        fetch('http://127.0.0.1:3001/account/get_accounts', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((res) => res.json())
            .then((response) => {
                setAllUsers(response);
            });
    }, [])
    const handleInputChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
        setForm({
            ...form,
            [ev.target.name]: ev.target.value
        })
    };
    const handleOnClick = () => {
        fetch('http://127.0.0.1:3001/task/create_task', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({...form}),
        })
            .then((res) => res.json())
            .then((response) => {
                setForm({
                    content: '',
                    cost: 0,
                })
                setData([...data, response]);
            });
    };

    const onClickReserve = (id: number) => {
        fetch('http://127.0.0.1:3001/task/reserve_task', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({task_id: id, reserved_by: props.user.email}),
        }).then((res) => res.json()).then((response) => {
            setData(state => state.filter((task: Task) => task.id !== id));
            setData(state => [response, ...state]);
        })
    };

    const onClickFinish = (id: number) => {
        fetch('http://127.0.0.1:3001/task/finish_task', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({task_id: id}),
        }).then((res) => res.json()).then((response) => {
            setData(state => state.filter((task: Task) => task.id !== id));
            setData(state => [response.task, ...state]);
            props.user.paycheck = response.paycheck;
        })
    };

    const onClickPaycheck = (email: string) => {
        fetch('http://127.0.0.1:3001/account/payout_paycheck', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({email: email}),
        }).then((res) => res.json()).then((response) => {
            setAllUsers(state => state.filter((userAccount: UserAccount) => userAccount.email !== email));
            setAllUsers(state => [response, ...state]);
        })
    }

    return (
        <>
            {props.user.email ? <div>
                {props.user.position == 1 ?
                    <>
                        <div style={{
                            display: "flex",
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginTop: "50px"
                        }}>
                            <TextField id="outlined-basic" label="Tresc" variant="outlined" onChange={handleInputChange}
                                       name={'content'} value={form.content}/>
                            <TextField id="outlined-basic" label="Koszt" variant="outlined" type={"number"}
                                       onChange={handleInputChange} name={'cost'} value={form.cost}/>
                            <Button variant="contained" onClick={handleOnClick}>Dodaj zadannie</Button>
                        </div>
                        <div style={{
                            display: "flex",
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginTop: "50px",
                            flexDirection: "column"
                        }}>
                            <div><h1>Zadania dla pracownikow</h1></div>
                            <TableContainer component={Paper} style={{maxWidth: "800px", marginBottom: '50px'}}>
                                <Table sx={{minWidth: 700}} aria-label="customized table">
                                    <TableHead>
                                        <TableRow>
                                            <StyledTableCell>Id</StyledTableCell>
                                            <StyledTableCell align="right">Tresc</StyledTableCell>
                                            <StyledTableCell align="right">Wykonawca</StyledTableCell>
                                            <StyledTableCell align="right">Status</StyledTableCell>
                                            <StyledTableCell align="right">Wycena</StyledTableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {data.map((row: Task) => (
                                            <StyledTableRow key={row.id}>
                                                <StyledTableCell component="th" scope="row">
                                                    {row.id}
                                                </StyledTableCell>
                                                <StyledTableCell align="right">{row.content}</StyledTableCell>
                                                <StyledTableCell align="right">{row.reserved_by}</StyledTableCell>
                                                <StyledTableCell align="right">{row.is_done == null ? "Czeka na rezerwacje" : (row.is_done ? "Wykonane" : "W trakcie realizacji")}</StyledTableCell>
                                                <StyledTableCell align="right">{row.cost}</StyledTableCell>
                                            </StyledTableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            <br/><br/><br/><br/><br/><br/>
                            <div><h1>Lista pracownikow</h1></div>
                            <TableContainer component={Paper} style={{maxWidth: "800px", marginBottom: '50px'}}>
                                <Table sx={{minWidth: 700}} aria-label="customized table">
                                    <TableHead>
                                        <TableRow>
                                            <StyledTableCell align="right">Imie</StyledTableCell>
                                            <StyledTableCell align="right">Nazwisko</StyledTableCell>
                                            <StyledTableCell align="right">Email</StyledTableCell>
                                            <StyledTableCell align="right">Wyplata</StyledTableCell>
                                            <StyledTableCell align="right">Wyplac pieniadze</StyledTableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {allUsers.map((row) => (
                                            <StyledTableRow key={row.email}>
                                                <StyledTableCell align="right">{row.first_name}</StyledTableCell>
                                                <StyledTableCell align="right">{row.last_name}</StyledTableCell>
                                                <StyledTableCell align="right">{row.email}</StyledTableCell>
                                                <StyledTableCell align="right">{row.paycheck ?? "0"}</StyledTableCell>
                                                <StyledTableCell align="right">{row.paycheck ? <Button variant="contained" onClick={() => onClickPaycheck(row.email)}>Wyplac pracownikowi: {row.paycheck} zł</Button> : <></>}</StyledTableCell>
                                            </StyledTableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>
                    </>
                    :
                    <div style={{
                        display: "flex",
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: "50px",
                        flexDirection: "column"
                    }}>
                        <h1>Twoja aktualna wypłata: {props.user.paycheck ?? "0"}</h1>
                        <div><h1>Zadania dla pracownikow</h1></div>
                        <TableContainer component={Paper} style={{maxWidth: "800px", marginBottom: '50px'}}>
                            <Table sx={{minWidth: 700}} aria-label="customized table">
                                <TableHead>
                                    <TableRow>
                                        <StyledTableCell>Id</StyledTableCell>
                                        <StyledTableCell align="right">Tresc</StyledTableCell>
                                        <StyledTableCell align="right">Wykonawca</StyledTableCell>
                                        <StyledTableCell align="right">Status</StyledTableCell>
                                        <StyledTableCell align="right">Wycena</StyledTableCell>
                                        <StyledTableCell align="right">Rezerwacja</StyledTableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {data.map((row: Task) => (
                                        <StyledTableRow key={row.id}>
                                            <StyledTableCell component="th" scope="row">
                                                {row.id}
                                            </StyledTableCell>
                                            <StyledTableCell align="right">{row.content}</StyledTableCell>
                                            <StyledTableCell align="right">{row.reserved_by}</StyledTableCell>
                                            <StyledTableCell
                                                align="right">{row.is_done == null ? "Czeka na rezerwacje" : (row.is_done ? "Wykonane" : "W trakcie realizacji")}</StyledTableCell>
                                            <StyledTableCell align="right">{row.cost}</StyledTableCell>
                                            <StyledTableCell align="right">{row.reserved_by == null ?
                                                <Button variant="contained" color="success"
                                                        onClick={() => onClickReserve(row.id)}>
                                                    Zarezerwuj
                                                </Button> : (row.reserved_by !== props.user.email ?
                                                    <Button variant="contained" color="error">Zarezerwowane</Button> :
                                                    (!row.is_done ? <Button variant="contained" color="secondary" onClick={() => onClickFinish(row.id)}>Ukończ
                                                        zadanie</Button> : <Button variant="outlined" color="secondary">Wykonane</Button>))}
                                            </StyledTableCell>
                                        </StyledTableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>}
            </div> : <h1>Musisz sie zalogowac</h1>}
        </>
    );
};

export default MainPage;