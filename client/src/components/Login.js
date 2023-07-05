import React, { useContext } from 'react'
import { Link } from "react-router-dom";
import NoteContext from '../context/NoteContext';
import "../login.css";
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Login() {

    const context = useContext(NoteContext)

    // eslint-disable-next-line
    let EMAIL_REGX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/    
    
    const handleLogIn = (e) => {
        e.preventDefault();
        const elementEmail = document.getElementById("email");
        const elementPassword = document.getElementById("password");

        const email = elementEmail.value;
        const password = elementPassword.value;
              
        let checkEmail = EMAIL_REGX.test(email);
        const emailErr = document.getElementById("emailErr");

        if(!checkEmail)        
        {
            emailErr.style.visibility="visible";        
            emailErr.innerHTML="Please Enter valid email address"
            setTimeout(() => {
                emailErr.style.visibility="hidden";            
            }, 2000);
        }
        else
            emailErr.style.visibility="hidden";        

        let checkPass = (password.length<8?false:true);
        const passwordErr = document.getElementById("passwordErr");

        if(!checkPass)        
        {
            passwordErr.style.visibility="visible";        
            passwordErr.innerHTML="Password must be 8 or more characters";
            setTimeout(() => {
                passwordErr.style.visibility="hidden";            
            }, 2000);
        }
        else
            passwordErr.style.visibility="hidden";        

        // elementEmail.value = elementPassword.value = "";

        const userData = {
            email: email,
            password: password
        }
        if(checkEmail && checkPass)
            context.loginUser(userData,elementEmail,elementPassword);
        // document.getElementById('mainBox').classList.remove('mainBox1');
        // document.getElementById('mainBox').classList.add('mainBox');
        // console.log(document.getElementById('mainBox'));

    }

    return (
        <div className='login'>
            <div className='container setPadding'>
                <form onSubmit={handleLogIn} noValidate>
                    {/* <h2>Add Note</h2>
                    <div className="mb-3">
                        <label htmlFor="exampleInputEmail1" className="form-label">Title</label>
                        <input type="text" className="form-control" id="title" name="title" aria-describedby="emailHelp" />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="exampleInputEmail1" className="form-label">Tag</label>
                        <input type="text" className="form-control" id="tag" name="tag" aria-describedby="emailHelp" />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="exampleInputPassword1" className="form-label">Description</label>
                        <input type="text" className="form-control" id="description" name="description" />
                    </div> */}
                    
                    <div className="loginBox boxColor">
                        <h2 className='text-center my-3 mb-4'>Log in</h2>
                        <div className="px-3">
                            <input type="email" className="form-control2" placeholder= "Email" id="email" name="email"/>
                            <small id={"emailErr"} style={{fontSize:"12px", color:"red",visibility:"hidden"}}>xyz</small>
                        </div>
                        <div className='px-3'>
                            <input type="password" className="form-control2" placeholder="Password" id="password" name="password" />
                            <small id="passwordErr" style={{fontSize:"12px",color:"red",visibility:"hidden"}}>xyz</small>
                        </div>
                        <div className='my-4 px-2 pe-4'>
                            <button style={{height:"50px",width:"100%",fontSize:"18px"}} type="submit" className="btn btn-dark mx-2">Log in</button>
                        </div>
                        <div className='text-center'>
                            <p>Don&lsquo;t have an account? <Link style={{ cursor: "pointer" }} to="/signup">Sign up</Link></p>
                        </div>
                    </div>
                </form>
            </div>
            <ToastContainer limit={1} toastStyle={{backgroundColor:"black",color:"white"}} icon={false} hideProgressBar closeButton={false} />
        </div>
    )
}
