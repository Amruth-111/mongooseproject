let amount=document.getElementById("amount")
let description=document.getElementById("description")
let category=document.getElementById("category")
let button=document.getElementById("press")
let error=document.getElementById("error")
let parentNode=document.getElementById("allExpenses")
let success=document.getElementById("success")
const downloadbtn=document.getElementById("download")

function ispremium(){
    premium_success();
    // let successTxt=document.createTextNode("You are a premium user..!!!");
    // success.appendChild(successTxt);
    // success.style.color="green";
    // document.getElementById("premium").style.visibility="hidden"
    // let download=document.createElement('button');
    // download.innerHTML="Download"
    // download.style.borderRadius="20px"
    // download.style.marginTop="10px"

    // // download.createTextNode("download")
    // download.setAttribute("id","download")
    // downloadbtn.appendChild(download)
    downloaded();
    
}

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}
window.addEventListener("DOMContentLoaded", async()=>{
    try{
        const token=localStorage.getItem("token");
        const isdecodedpremium=parseJwt(token);
        console.log(isdecodedpremium)
        const isPremiumUser=isdecodedpremium.ispremium
        if(isPremiumUser){
            ispremium()
            showleaderboard();
        }
        // let response=await axios.get("http://localhost:8081/expense/show-expenses",{headers:{'Authentication':token}})
        // console.log(response);
        // console.log(response.data)
        // for(let i=0;i<response.data.allexpenses.length;i++){
        //     showBrowser(response.data.allexpenses[i])
        // }
        pagination();
    }catch(err){
        console.log("DOM get error-->",err) 
    }
})

async function pagination(){
    try{
    const token=localStorage.getItem('token');
    let response=await axios.get("http://localhost:8081/expense/show-expenses",{headers:{'Authentication':token}})
    console.log(response.data.allexpenses)
    let pagination=document.getElementById("pagination")

    let totalPageSize=localStorage.getItem("pagesize");
    const totalpage=Math.ceil((response.data.allexpenses.length)/totalPageSize)
    if(!totalPageSize){
        localStorage.setItem("pagesize",5)
       }
       const result=await axios.get(`http://localhost:8081/expense/pagination?page=${1}&pagesize=${5}`,{headers:{"Authentication":token}})
       let allExpense=result.data.Data
       console.log(allExpense)
       
       for(let i=0;i<allExpense.length;i++){
           
           showBrowser(result.data.Data[i])    
           }
           for(let i=0;i<totalpage;i++){
            let page=i+1
            button=document.createElement("button")
            button.innerHTML=i+1
            
                button.onclick=async()=>{
                    parentNode.innerHTML=""
                    const ress=await axios.get(`http://localhost:8081/expense/pagination?page=${page}&pagesize=${totalPageSize}`,{headers:{"Authentication":token}})
                    let allExpense=ress.data.Data
                    for(let i=0;i<allExpense.length;i++){
                        showBrowser(ress.data.Data[i])    
                        }
                } 
        pagination.appendChild(button)
        }  
    }catch(err){
        console.log("pagination error",err)
    }
   
}


async function showBrowser(show){
    try{

        const pagesize=document.getElementById("pagesize")
        pagesize.addEventListener("click",()=>{
            localStorage.setItem("pageSize",pagesize.value)
            window.location.reload()
           })
        const newExpense=`<table id=${parseInt(show._id)} class="table text-white ">
        <tr>
        <td><li></li></td>
        <td>${show.amount}</td>
        <td>${show.description}</td>
        <td>${show.category}</td>
        <td><button onclick="deleteExpense(${parseInt(show._id)})" style="float:right" class="btn btn-danger" >delete</button></td>
        </tr>
        </table>`
        parentNode.innerHTML=parentNode.innerHTML+newExpense
      
        // var childNode=`<li id=${data.id}>${data.amount}&nbsp;&nbsp;&nbsp;&nbsp;${data.description}&nbsp;&nbsp;&nbsp;&nbsp;${data.category}
        // <button class="btn bg-danger float-sm-end" onclick="deleteExpense(${data.id})">delete</button>
        // <button class="btn bg-primary float-sm-end" onclick="editExpense('${data.id}','${data.amount}','${data.description}','${data.category}')" >edit</button></li>`
        // parentNode.innerHTML=parentNode.innerHTML+childNode;
    }
    catch(err){
        console.log("showbrowser error!",err)
    }
}

async function deleteExpense(key){
    const token=localStorage.getItem("token");
    await axios.delete(`http://localhost:8081/expense/delete-expenses/${key}`,{headers:{'Authentication':token}})
    const child=document.getElementById(key)
    parentNode.removeChild(child)
}

button.addEventListener("click",async(e)=>{
    const token=localStorage.getItem("token");
    const decodeToken=parseJwt(token)
    console.log("button is clicked")
    try{
        e.preventDefault();
        let exp_obj={
            amount:amount.value,
            description:description.value,
            category:category.value,
            userId:decodeToken.userId
        }

        let response=await axios.post("http://localhost:8081/expense/expenses",exp_obj,{headers:{'Authentication':token}})
        console.log(response);
        showBrowser(response.data.newexpense);
    
    }catch(e){
        console.log("error in submit button");
        console.log(`${e.message}`);
    }
   
    amount.value="";
    category.value="";
    description.value="";
})

document.getElementById("premium").onclick=async(e)=>{
    try{
        let token=localStorage.getItem("token");
        console.log(token)
        let response=await axios.get("http://localhost:8081/purchase/buy-premium",{headers:{"Authentication":token}})
        console.log(response)
        let options={
            'key':response.data.key_id,
            "order_id":response.data.order.id,
            "handler":async function(response){
                let result=await axios.post("http://localhost:8081/purchase/updatetransactionstatus",{
                    order_id:options.order_id,
                    payment_id:response.razorpay_payment_id
                },{headers:{"Authentication":token}})
                alert(result.data.message)
                premium_success();
                
                localStorage.setItem("token",result.data.token)
                showleaderboard();
                downloaded();

            },
        }
        const rzp1=new Razorpay(options);
        rzp1.open();
        e.preventDefault();
    
        rzp1.on("payment.failed",async()=>{
            try{
                let key=response.data.order.id
                let failed=await axios.post("http://localhost:8081/purchase/updatetransactionstatus",{
                    order_id:key,
                    payment_id:null
                },{headers:{"Authentication":token}})
                alert(failed.data.message)
                let successTxt=document.createTextNode(failed.data.message);
                success.appendChild(successTxt);
                success.style.color="red";
                setTimeout(()=>{
                    success.removeChild(successTxt)
                },4000)
                
               
            }catch(e){
                console.log("error in payment fail section",e)
            }
        })
           
    }catch(err){
        console.log("err in front end of razorpay",e)
    }
    
    
} 


function premium_success(){
    let successTxt=document.createTextNode('Hurrey..!! you are a premium user now');
    success.appendChild(successTxt);
    success.style.color="white";
    document.getElementById("premium").style.visibility="hidden"
    setTimeout(()=>{
        success.removeChild(successTxt)
    },5000)
}


async function showleaderboard(){
    try{
        let token=localStorage.getItem("token")
        
        let parent=document.getElementById("leaderboard")
        let button=document.createElement('input')
        button.type="button";
        button.className="my-button"
        button.value="show leaderboard";
        button.style.marginTop="10px"
        console.log(button)
        console.log(parent)
        button.onclick=async()=>{
        let userleaderboardarray=await axios.get("http://localhost:8081/premium/show-leaderboard",{headers:{"Authentication":token}})
        console.log(userleaderboardarray.data.leaderboardofusers);


        let leaderboard=userleaderboardarray.data.leaderboardofusers
        let leaderboards=document.getElementById("list");
        let text=document.createTextNode("!!..LEADERBOARD..!!")
        document.getElementById("text").appendChild(text)
        leaderboard.forEach(userdetails => {
        leaderboards.innerHTML+=`<li style="color:white">Name-->>>${userdetails.name}-->>>Total expense-${userdetails.totalExpenses}`
        });
    }
    parent.appendChild(button)

    }catch(e){
        console.log("error in leaderboard front end")
    }
    
    
}

async function downloaded(){
    try{
    let token=localStorage.getItem("token");
    let download=document.createElement('input');
    download.type="button"
    download.value="Download"
    download.className="my-button"
    download.style.borderRadius="20px"
    download.style.marginTop="10px"
    console.log(download)
    // download.setAttribute("id","download")
    download.onclick=async()=>{
        console.log("d is clicked")
        const downloadedres=await axios.get("http://localhost:8081/expense/download-expenses",{headers:{"Authentication":token}})
        if(downloadedres.data.success===true){
            var a =document.createElement('a');
            a.href=downloadedres.data.Url
            a.download='myexpenses.csv'
            a.click()
        }else{
            throw new Error(downloadedres.data.message)
        }
    }
    downloadbtn.appendChild(download)

    }catch(e){
            console.log(e)
    }
}
