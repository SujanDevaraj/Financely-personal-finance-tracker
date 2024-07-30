import React,{useState} from 'react'
import { useNavigate } from 'react-router-dom';
import "./styles.css";
import Input from "../Input"
import Button from "../Button"
import {auth, db,provider} from "../../firebase";
import {toast} from 'react-toastify'
import { doc, setDoc,getDoc } from "firebase/firestore"; 
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import {createUserWithEmailAndPassword,signInWithEmailAndPassword } from "firebase/auth";

function SignupSigninComponent() {
  const [name, setName]= useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginForm, setLoginForm] = useState(false);
  const navigate = useNavigate();

function signupWithEmail(){
setLoading(true);
  if(name!="" && email!="" && password!="" && confirmPassword!=""){
    if(password === confirmPassword){
      createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed up 
      const user = userCredential.user;
      console.log("user>>>",user);
      toast.success("user created!");
      setLoading(false);
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      createDoc(user);
      navigate("/dashboard");
      // create doc with user id as following id
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      toast.error(errorMessage);
      setLoading(false);
      // ..
    });

    }else{
      toast.error("Password and Confirm Password don't match!");
      setLoading(false);
    }
    

  }else{
    toast.error("All fields are mandatory!");
    setLoading(false);
  }
 
}
function loginUsingEmail(){
  console.log("Email",email);
  console.log("password",password);
  setLoading(true);

  if(email!="" && password!=""){
    signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    toast.success("User Logged In!");
    setLoading(false);
    navigate("/dashboard");
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    toast.error(errorMessage);
    setLoading(false);
  });
    
  }else{
    toast.error("All fields are madatory!");
    setLoading(false);
  }

}


async function createDoc(user) {
 // make sure the doc with uid does not exist
  //create a doc 
  setLoading(true);
  if(!user) return;
  const userRef = doc(db, "users",user.uid);
  const userData = await getDoc(userRef);
  if(!userData.exists()){
    try{
      await setDoc(doc(db, "users", user.uid), {
        name:user.displayName ? user.displayName : name,
        email:user.email,
        photoURL: user.photoURL ? user.photoURL : "",
        createdAt:new Date(),
      });
      toast.success("DOC created!");
      setLoading(false);
    }
    catch(e){
      toast.error(e.message);
      setLoading(false);
    }
  }else{
    //toast.error("Doc already exists");
    setLoading(false);
  }  
}
function googleAuth(){
 setLoading(true);
 try {
  signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      createDoc(user);
      setLoading(false);
      navigate("/dashboard")
      toast.success("User Authenticated!");

      // IdP data available using getAdditionalUserInfo(result)
      // ...
    }).catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      toast.error(errorMessage);
      setLoading(false);
      // The email of the user's account used.

    });
 } catch (e) {
  toast.error(e.message)
  setLoading(false);
 }
  
  
}

  return (
    <>
    {loginForm ? 
     <div className="signup-wrapper">
     <h2 className="title">Login on <span style={{color:"var(--theme)"}}>Financely.</span></h2>
     <form>
       
       <Input
       type="email"
       label={"Email"}
       state={email}
       setState={setEmail}
       placeholder={"JohnDoe@gmail.com"}
       />
       <Input
       type="password"
       label={"Password"}
       state={password}
       setState={setPassword}
       placeholder={"Example@123"}
       />
       
       <Button
       disabled={loading}
        text={loading ? "Loading.." : "Login Using Email and Password"}
       onClick={loginUsingEmail} />
       <p className="p-login">or</p>
       <Button
       onClick={googleAuth}
       text={loading ? "Loading.." : "Login Using Google"} />
       <p className="p-login" style={{cursor:"pointer"}} onClick={()=>setLoginForm(!loginForm)}>
        or Don't Have An Account? Click Here</p>
       </form>
   </div> :  <div className="signup-wrapper">
      <h2 className="title">Sign Up on <span style={{color:"var(--theme)"}}>Financely.</span></h2>
      <form>
        <Input
        type="text"
        label={"Full Name"}
        state={name}
        setState={setName}
        placeholder={"John Doe"}
        />
        <Input
        type="email"
        label={"Email"}
        state={email}
        setState={setEmail}
        placeholder={"JohnDoe@gmail.com"}
        />
        <Input
        type="password"
        label={"Password"}
        state={password}
        setState={setPassword}
        placeholder={"Example@123"}
        />
        <Input
        type="password"
        label={"Confirm Password"}
        state={confirmPassword}
        setState={setConfirmPassword}
        placeholder={"Example@123"}
        />
        <Button
        disabled={loading}
         text={loading ? "Loading.." : "Signup Using Email and Password"}
        onClick={signupWithEmail} />
        <p className="p-login">or</p>
        
        <Button
        onClick={googleAuth} 
        text={loading ? "Loading.." : "Signup Using Google"} />
        
        <p className="p-login" style={{cursor:"pointer"}} onClick={()=>setLoginForm(!loginForm)}>or Have An Account Already? Click Here</p>
        </form>
    </div>}
   
    </>
  )
}

export default SignupSigninComponent;