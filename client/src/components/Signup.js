import React, { useContext } from 'react'
import { Link } from "react-router-dom";
import NoteContext from '../context/NoteContext';
import "../login.css";
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Signup() {
    const context = useContext(NoteContext)

    // eslint-disable-next-line
    let EMAIL_REGX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/    

    let NAME_REGX =  /^[A-Za-z ]*$/

    const handleSignup = (e) => {
        e.preventDefault();
        const elementUserName = document.getElementById("userName");
        const elementEmail = document.getElementById("email");
        const elementPassword = document.getElementById("password");
        const elementConfirmPassword = document.getElementById("cpassword");

        const userName = elementUserName.value;
        const email = elementEmail.value;
        const password = elementPassword.value;
        const confirmPassword = elementConfirmPassword.value;

        let checkUsername = NAME_REGX.test(userName);
        const usernameErr = document.getElementById("usernameErr");

        if(userName.length===0)checkUsername=false;

        //check username
        if(!checkUsername)        
        {
            usernameErr.style.visibility="visible";        
            if(userName.length===0)
                usernameErr.innerHTML="User name must contain at least one letter"
            else
                usernameErr.innerHTML="User name must contain only letters"
            setTimeout(() => {
                usernameErr.style.visibility="hidden";            
            }, 2000);
        }
        else
            usernameErr.style.visibility="hidden";        

        let checkEmail = EMAIL_REGX.test(email);
        const emailErr = document.getElementById("emailErr");

        //check email
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

        //check password
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

        //check confirm password        
        let checkConfirmPass = ((password.length!==confirmPassword.length)?false:true);
        const confirmPasswordErr = document.getElementById("confirmPassErr");

        if(!checkConfirmPass)        
        {
            confirmPasswordErr.style.visibility="visible";        
            confirmPasswordErr.innerHTML="Passwords does not match";
            setTimeout(() => {
                confirmPasswordErr.style.visibility="hidden";            
            }, 2000);
        }
        else
            confirmPasswordErr.style.visibility="hidden";    
        // elementUserName.value = elementEmail.value = elementPassword.value = elementConfirmPassword.value = "";

        const userData = {
            name: userName,
            email: email,
            password: password
        }
        if(checkUsername && checkEmail && checkPass && checkConfirmPass)
            context.addUser(userData,elementUserName,elementEmail,elementPassword,elementConfirmPassword);
        // document.getElementById('mainBox').classList.remove('mainBox1');
        // document.getElementById('mainBox').classList.add('mainBox');
        // console.log(document.getElementById('mainBox'));

    }

    return (
        <div className='login'>
            <div className='container setPaddingSignUp'>
                <form action="http://localhost:5000/api/user/signup" method='post' onSubmit={handleSignup} noValidate>
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
                        <h2 className='text-center my-3 mb-4'>Sign up</h2>
                        <div className="px-3">
                            <input type="text" className="form-control2" placeholder="Name" id="userName" name="userName" />
                            <small id="usernameErr" style={{fontSize:"12px",color:"red",visibility:"hidden"}}>xyz</small>
                        </div>
                        <div className="px-3">
                            <input type="email" className="form-control2" placeholder="Email" id="email" name="email" />
                            <small id={"emailErr"} style={{fontSize:"12px", color:"red",visibility:"hidden"}}>xyz</small>
                        </div>
                        <div className='px-3'>
                            <input type="password" className="form-control2" placeholder="Password" id="password" name="password" />
                            <small id="passwordErr" style={{fontSize:"12px",color:"red",visibility:"hidden"}}>xyz</small>
                        </div>
                        <div className='px-3'>
                            <input type="password" className="form-control2" placeholder="Confirm password" id="cpassword" name="cpassword" />
                            <small id="confirmPassErr" style={{fontSize:"12px",color:"red",visibility:"hidden"}}>xyz</small>
                        </div>
                        <div className='my-4 px-2 pe-4'>
                            <button style={{ height: "50px", width: "100%", fontSize: "18px" }} type="submit" className="btn btn-dark mx-2">Sign up</button>
                        </div>
                        <div className='text-center'>
                            <p>Already have an account? <Link style={{ cursor: "pointer" }} to="/login">Log in</Link></p>
                        </div>
                    </div>
                </form>
            </div>
            <ToastContainer limit={1} toastStyle={{backgroundColor:"black",color:"white"}} icon={false} hideProgressBar closeButton={false} />
        </div>
    )
}
