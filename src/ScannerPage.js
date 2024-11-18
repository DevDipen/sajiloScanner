import React, { useState,useEffect } from "react"
import { QrReader } from "react-qr-reader"
import { useNavigate } from "react-router-dom"
import "./ScannerPage.css" // Import the CSS file





function ScannerPage({ setIsAuthenticated }) {
  const [scannedData, setScannedData] = useState(null)
  const [finalParsedData, setFinalParsedData] = useState(null)
  const navigate = useNavigate()
 
  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.clear()
    navigate("/")
  }

  const handleScan = (data) => {
    console.log(data)
    if (data) {
      // setScannedData(()=>data)
      setTimeout(()=>parseScannedData(data),300)
    }
  }

  const handleError = (err) => {
    console.error("QR Scanner Error:", err)
  }


  let parsedData = {}

  const handleUpdateCustomer = () => {
    if (!scannedData) {
      alert("Please scan data first!")
      return
    }
    


    fetch("http://localhost:5000/api/bookings/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(finalParsedData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "Booking status updated") {
          alert("Booking status updated successfully!")
          setScannedData(()=>null)
        } else {
          console.error("Error Response:", data)
          alert(data.message || "Failed to update booking status")
        }
      })
      .catch((error) => {
        console.error("Error updating booking status:", error)
        alert("Error updating booking status")
      })
  }

  const parseScannedData = (rawData) => {
       
    console.log(rawData)
    const pData = rawData?.split("\n")
      .map((data)=> data.trim())
      .filter((data)=>data.length > 0)

      
      pData.forEach((entry) => {
        const key = entry.split(":")[0].trim()
        const value = entry.slice(entry.indexOf(":")+1).trim()
        parsedData[key] = value
      })
    
      
    parsedData = Object.keys(parsedData)
      .map((key)=>({[key]:parsedData[key].slice(0,-1)}))
      .reduce((acc, obj) => ({ ...acc, ...obj }), {})
      
    parsedData["Seats"] = {
      numberOfSeats:parsedData["Seats"].split(",")
        .filter(Boolean)
        .map((seat)=>seat.at(-1))
        .reduce((a,b)=>+a + +b,0),
      seatDescription:parsedData["Seats"].split(",").map((data)=>data.trim()).filter(Boolean)
    }

    //remove float after decimal point
    parsedData["Price"]=+parsedData["Price"]


    setScannedData(parsedData)
    setFinalParsedData(()=>({
      customerName: parsedData["Name"],
      numberOfTickets: parsedData["Seats"].numberOfSeats,
      totalPaidAmount: parsedData["Price"]
    }))

   
  }

  return (
    <div className='scanner-container'>
      <div className='scanner-content'>
        <h2>QR Code Scanner</h2>


          <div className='scanner-box'>
            <QrReader
              constraints={ {video:{facingMode: 'environment'}} }
              onResult={(result, error) => {
                if (!!result) handleScan(result?.text)
                // if (!!error) handleError(error)
              }}
              
              style={{ width: "100%", height: "100%" }}
            />
          </div>

        {scannedData && (
          <div className='scanned-data'>
            <h3>Scanned Data</h3><br />
            {
              Object.keys(scannedData)
                .map((key)=>
                  key==="Seats"?
                  <p key={key}>
                    <strong>{key}: </strong>
                    <span>{scannedData[key]?.seatDescription.join(" & ")}</span>
                  </p>
                  :
                  <p key={key}>
                    <strong>{key}: </strong>
                    <span>{scannedData[key]}</span>
                  </p>
                )
            }
            <br />
          </div>
        )}

        <button onClick={handleUpdateCustomer} className='update-button'>
          Update Booking
        </button>
        <button onClick={handleLogout} className='logout-button'>
          Logout
        </button>
      </div>
    </div>
  )
}

export default ScannerPage
