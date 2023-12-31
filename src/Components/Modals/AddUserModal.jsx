import { useEffect, useState } from 'react';
import { useData } from '../../Context/UserData';
import './AddUserModal.css';
import { DepositForm, WithdrawForm, TransferForm} from './TransactionsModal';
import { CSSTransition } from 'react-transition-group';
import BudgetAppModal from './BudgetAppModal';

function AddUserModal(props) {
    const { isModalOpen, closeModal, activeModal } = useData();
    const { user } = props;
    
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (isModalOpen && e.target.classList.contains('addUser-modal')) {
                closeModal();
            }
        }

        const handleDocumentClick = (e) => {
            handleClickOutside(e);
        }

        if (isModalOpen){
            document.addEventListener('click', handleDocumentClick)
        } else {
            document.removeEventListener('click', handleDocumentClick)
        }

        return () => {
            document.removeEventListener('click', handleDocumentClick)
        }
    }, [isModalOpen, closeModal])
    
    if (!isModalOpen) return null;

    function RenderModal() {
        switch (activeModal) {
            case 'adduser':
                return <AddUserForm user={user} />
            case 'deposit':
                return <DepositForm user={user}/>
            case 'withdraw':
                return <WithdrawForm user={user}/>
            case 'transfer':
                return <TransferForm user={user}/>
            case 'budget':
                return <BudgetAppModal user={user}/>    
            default:
                return null;
        }
    }

    return (
        <CSSTransition
        in={isModalOpen}
        timeout={300}
        classNames="fade"
        >
            
        <div className='addUser-modal'>
            <div className='addUser-formBox'>
                <RenderModal />
            </div>
        </div>
        </CSSTransition>
    )
}

function AddUserForm() {
    const { data, updateData, closeModal, triggerNotif, giveNotif } = useData();
    const [ username, setUsername ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ email, setEmail ] = useState('');
    const [ balance, setBalance ] = useState('');
    const [ errorMsg, setErrorMsg ] = useState('');

    const addUser = () => {
        const newUser = {
            username: username,
            password: password,
            email: email,
            isLoggedIn: false,
            balance: Number(balance),
            isAdmin: false,
            transactions: []
        }

        updateData(newUser);
    }

    const handleError = (message) => {
        setErrorMsg(message);
        alert(message);
    }

    const handleFormSubmit = (e) => {
        e.preventDefault();

        const usernameCheck = data.find((userObj) => 
        userObj.username.toLowerCase() === username.toLowerCase())

        if (/^\d/.test(username)){
            handleError(`Username cannot start with a number`);
        }else if (!usernameCheck){
            addUser();
            // alert(`New User Added!`);
            giveNotif(`Succesfully Added ${username}`)
            triggerNotif();
            closeModal();
        } else {
            handleError(`User already exists`)
        }
    }

    return (
        <form
            onSubmit={handleFormSubmit}
            className='add-user-form'
        >
            <h1>New Client Information</h1>
            <legend>
                <div className='input-box'>
                    <label>Username: </label>
                    <input 
                        type='text'
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    ></input>
                </div>
                <div className='input-box'>
                    <label>Password: </label>
                    <input 
                        type='text'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    ></input>
                </div>
                <div className='input-box'>
                    <label>Initial Balance: </label>
                    <input 
                        type='number'
                        value={balance}
                        onChange={(e) => setBalance(e.target.value)}
                        required
                    ></input>
                </div>
                <div className='input-box'>
                    <label>Email: </label>
                    <input 
                        type='email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    ></input>
                </div>
            </legend>
            <input
                type='submit'
                className='add-user-submit'
            ></input>
        </form>
    )
}

export default AddUserModal;