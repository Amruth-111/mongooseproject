const email=document.getElementById("email");
const mail=document.getElementById("mail");
let success=document.getElementById("success")


mail.addEventListener("click",sendmail)

async function sendmail(e){
    console.log("sendmail button clicked")
    try{
        e.preventDefault();
        let forgot_obj={
            email:email.value
        }
        const response=await axios.post("http://localhost:8081/password/forgot_password",forgot_obj)
        console.log(response)
        console.log(response.message)
        if(response.data.success===true){
           password_Reset_success();
        }else{
            const successtxt=document.createTextNode("failed..!!")
            success.appendChild(successtxt)
            success.style.color="red";
        }
    }catch(err){
        console.log("error in send mail button")
    }
   

}

function password_Reset_success(){
    const successtxt=document.createTextNode(response.data.message)
    success.appendChild(successtxt)
    success.style.color="green"
    setTimeout(()=>{
        success.removeChild(successtxt)
    },5000)
}