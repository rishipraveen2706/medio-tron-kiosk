import { useState,useEffect } from "react";
import "./App.css";

import tablet1img from "./assets/tablet1.png";
import tablet2img from "./assets/tablet2.png";
import tablet3img from "./assets/tablet3.png";
import tablet4img from "./assets/tablet4.png";

export default function App(){

  const [page,setPage]=useState("welcome");
  const [code,setCode]=useState("");
  const [medicines,setMedicines]=useState([]);
  const [apiUrl,setApiUrl] = useState("");
  useEffect(()=>{

  fetch("/config.json")
  .then(res=>res.json())
  .then(data=>{
    console.log("API URL:", data.api_url)
    window.API_URL = data.api_url;

    setApiUrl(data.api_url);
    
  });

},[]);

const verifyCode = async () => {

  if (!code) {
    alert("Enter Prescription Code");
    return;
  }

  try {

    const formattedCode = code.toUpperCase();
    const url = `${window.API_URL}/verify-code/${formattedCode}`;

    console.log("Calling:", url);

    const res = await fetch(url,{
      headers:{
        "Content-Type":"application/json",
        "ngrok-skip-browser-warning":"true"
      }
    });

    const data = await res.json();

    console.log("API response:", data);

    if (data.valid === true) {

      setMedicines(data.medicines || []);
      setPage("medicines");

    } else {
      alert("Invalid Prescription Code");
    }

  } catch (err) {
    console.error(err);
    alert("Machine connection failed");
  }

};
  const updateQty=(id,c)=>{
    setMedicines(prev=>prev.map(m=>m.id===id?{...m,qty:Math.max(0,m.qty+c)}:m));
  };

  const total=medicines.reduce((s,m)=>s+m.qty*m.price,0);

  /* -------- WELCOME -------- */

  if(page==="welcome"){
    return(
      <div className="center">
        <h1 className="machineBrand">MEDI-O-TRON</h1>
        <h3 style={{opacity:.8}}>Smart Medicine Dispensing System</h3>
        <button onClick={()=>setPage("prescription")}>Start</button>
      </div>
    )
  }

  /* -------- CODE -------- */

  if(page==="prescription"){
    return(
      <div className="center">
        <div className="glass">
          <h2 className="title-code">Enter Prescription Code</h2>
          <input value={code} onChange={e=>setCode(e.target.value)} />
          <br/><br/>
          <button onClick={verifyCode}>Verify</button>
        </div>
      </div>
    )
  }

  /* -------- MEDICINES -------- */

  if(page==="medicines"){
    return(
      <div className="container">

        <h2 className="sectionHeader title-prescribed">Prescribed Medicines</h2>

        {medicines.filter(m=>m.prescribed).map(m=>(
          <div className="card" key={m.id}>
            <img src={m.image}/>
            <div className="info">
              <b>{m.name}</b>
              <p>₹{m.price} • Stock {m.stock}</p>
              <div className="qty">
                <button onClick={()=>updateQty(m.id,-1)}>-</button>
                <span>{m.qty}</span>
                <button onClick={()=>updateQty(m.id,1)}>+</button>
              </div>
            </div>
          </div>
        ))}

        <h2 className="sectionHeader title-other">Other Medicines</h2>

        {medicines.filter(m=>!m.prescribed).map(m=>(
          <div className="card" key={m.id}>
            <img src={m.image}/>
            <div className="info">
              <b>{m.name}</b>
              <p>₹{m.price} • Stock {m.stock}</p>
              <div className="qty">
                <button onClick={()=>updateQty(m.id,-1)}>-</button>
                <span>{m.qty}</span>
                <button onClick={()=>updateQty(m.id,1)}>+</button>
              </div>
            </div>
          </div>
        ))}

        <button className="checkoutBtn" onClick={()=>setPage("summary")}>
          Checkout ₹{total}
        </button>

      </div>
    )
  }

  /* -------- SUMMARY -------- */

  if(page==="summary"){
    return(
      <div className="center">
        <div className="glass summaryCard">
          <h2 className="title-summary">Order Summary</h2>

          {medicines.filter(m=>m.qty>0).map(m=>(
            <div className="summaryRow" key={m.id}>
              <span>{m.name} × {m.qty}</span>
              <span>₹{m.qty*m.price}</span>
            </div>
          ))}

          <div className="summaryTotal">
            <span>Total</span>
            <span>₹{total}</span>
          </div>

          <br/>
          <button onClick={()=>setPage("payment")}>
            Proceed to Payment
          </button>
        </div>
      </div>
    )
  }

  /* -------- PAYMENT -------- */

  if(page==="payment"){
    return(
      <div className="center">
        <div className="glass">
          <h2 className="title-pay">Scan & Pay</h2>
          <img src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=upi://pay?am=${total}`} />
          <br/><br/>
          <button
  onClick={async () => {

    try {
      setPage("dispensing");

      const res = await fetch(`${window.API_URL}/pick`,{
        method:"POST",
        headers:{
          "Content-Type":"application/json",
          "ngrok-skip-browser-warning":"true"
         
        },
          body: JSON.stringify({
    code: code.toUpperCase()
  })
      });

      const data = await res.json();
      console.log(data);
    
    setPage("complete");
          // wait 5 seconds then go to home
    setTimeout(() => {
      setPage("welcome");
    }, 3000);

      

    } catch (err) {
      console.error(err);
      alert("Machine connection failed");
    }

  }}
>
  Payment Done
</button>
        </div>
      </div>
    )
  }

  /* -------- DISPENSING -------- */

  if(page==="dispensing"){
    return(
      <div className="center">
        <div className="glass">
          <h2 className="title-dispense">Dispensing Medicines…</h2>
      
        </div>
      </div>
    )
  }
  if (page === "complete") {
  return (
    <div className="center">
      <div className="glass">
        <h1 style={{color:"#4CAF50"}}>
          Medicines Successfully Dispensed
        </h1>
        <h3>Please collect from the tray</h3>
        <h3>Returning to home...</h3>
      </div>
    </div>
  )
}

} 
