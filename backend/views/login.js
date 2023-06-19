const email=document.getElementById("email")
const password=document.getElementById("password")
const login=document.getElementById("login")
const loginError=document.getElementById("loginError")
const loginSuccess=document.getElementById("loginSuccess")

login.addEventListener("click",loginpage);

async function loginpage(e){
    try{
        e.preventDefault();

        let loginObj={
            email:email.value,
            password:password.value,
        }
    
        let data=await axios.post("http://localhost:8081/user/signin",loginObj)
            localStorage.setItem('token',data.data.token)
            alert(data.data.message);
            console.log(data.data.token)

            if(data.data.success===false){
                const signinText=document.createTextNode(data.data.message)
                    loginError.appendChild(signinText)
                    loginError.style.color="red"
                    console.log(loginError)
                setTimeout(()=>{
                    loginError.removeChild(signinText)
                },4000)
            }
            if(data.data.success===true){
                const loginText=document.createTextNode(data.data.message)
                loginSuccess.appendChild(loginText)
                loginSuccess.style.color="green"
                console.log(loginSuccess)
            setTimeout(()=>{
                loginError.removeChild(signUpText)
            },4000)
            window.location.href="./expenses.html";
            }
           
    }catch(e){
        console.log(e)
        // document.body.innerHTML+=`<div style='color:red'>${e.message}</div>`

    }
   
}

