import React, { useState } from 'react';
import { GoogleMap, LoadScript, DirectionsService, DirectionsRenderer, Autocomplete  } from '@react-google-maps/api';
import './App.css';
import logo from './logo.JPG';
import Table from 'react-bootstrap/Table';

const lib=['places']
const key='AIzaSyAYBivEevsC3sXYWfY6n9803tvASqB0TUI'

const mapContainerStyle = {
  width: '400px',
  height: '400px'
};

const center = {
  lat: 28.6139,
  lng: 77.2090
};


const options = {
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: false,
  zoomControl: true,
  clickableIcons: false,
  styles: [
    {
      featureType: 'poi',
      stylers: [{ visibility: 'off' }]
    },
    {
      featureType: 'transit.station',
      stylers: [{ visibility: 'off' }]
    }
  ]
};

const logoBarStyle = {
  height: '70px',
  backgroundColor: '#fff',
  display: 'flex',
};



const inputContainerStyle = {
 
};

const inputStyle = {
  borderRadius: '5px', width: 205, height:30
};

const buttonStyle = {
  backgroundColor: '#4285F4',
  color: '#fff',
  border: 'none',
  padding: '10px 20px',
  borderRadius: '5px',
  cursor: 'pointer'
};

const buttstyle={
  backgroundColor: '#F0F8FF',
  color: 'black',
  border: 'none',
  padding: '10px 20px',
  borderRadius: '5px',
  cursor: 'pointer',
  width: 205, height:30
};

const delStyle={
  backgroundColor: '#4285F4',
  color: '#fff',
  border: 'none',
  padding: '10px 20px',
  borderRadius: '5px',
  cursor: 'pointer',
  marginBottom: 30
};



function App() {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [waypoints, setWaypoints] = useState([]);
  const [directions, setDirections] = useState(null);
  const [originError, setOriginError] = useState('');
  const [destinationError, setDestinationError] = useState('');
  const [distance, setDistance] = useState(null);

  const [originAutocomplete, setOriginAutocomplete] = useState(null);
  const [destinationAutocomplete, setDestinationAutocomplete] = useState(null);
  const [waypointAutocompletes, setWaypointAutocompletes] = useState([]);

  
  
  const handleOriginChange = (e) => {
    setOrigin(e.target.value);
    setOriginError('');
  };

  const handleDestinationChange = (e) => {
    setDestination(e.target.value);
    setDestinationError('');
  };

  const handleOriginSelect = (address) => {
    setOrigin(address);
  };

  const handleDestinationSelect = (address) => {
    setDestination(address);
  };

  const handleWaypointSelect = (address, index) => {
    const newWaypoints = [...waypoints];
    newWaypoints[index] = { location: address };
    setWaypoints(newWaypoints);
  };

  const handleAddWaypoint = () => {
    setWaypoints([...waypoints, { location: '', stopover: true }]);
  };

  const handleWaypointChange = (e, index) => {
    const newWaypoints = [...waypoints];
    newWaypoints[index].location = e.target.value;
    setWaypoints(newWaypoints);
  };

  const handleDeleteWaypoint = (index) => {
    const newWaypoints = [...waypoints];
    newWaypoints.splice(index, 1);
    setWaypoints(newWaypoints);
  };

  
  const handleSubmit = () => {
    const directionsService = new window.google.maps.DirectionsService();

    const waypointsArr = waypoints.map((waypoint) => ({
      location: waypoint.location,
      stopover: waypoint.stopover
    }));

    directionsService.route(
      {
        origin,
        destination,
        waypoints: waypointsArr,
        travelMode: 'DRIVING'
      },
      (result, status) => {
        if (status === 'OK') {
          handleDirections(result);
        }
      }
    );
  };

  

  const validateInputs = () => {
    let valid = true;

    if (!origin) {
      setOriginError('Please enter a valid origin');
      valid = false;
    }

    if (!destination) {
      setDestinationError('Please enter a valid destination');
      valid = false;
    }

    return valid;
  };

  const handleCalculateClick = () => {
    if (validateInputs()) {
      handleSubmit();
    }
  };

  const handleDirections = (result) => {
    setDirections(result);
    const distance = result.routes[0].legs.reduce((total, leg) => total + leg.distance.value, 0) / 1000; // Calculate distance in km
    setDistance(distance);
  };

  


  
  return (
    <div style={{background: '#F0F8FF',}}>
      <div style={logoBarStyle}>
        <img src={logo} alt="Logo" />
      </div>
      <p style={{textAlign:"center",color:"blue",fontSize:20}}>Let's calculate <b>distance</b> from Google Maps</p>
      <Table style={{
        width:'100%',
        background: '#F0F8FF',
        backdropFilter: 'blur(10px)',
        boxShadow: '0px 0px 2px rgba(0, 0, 0, 0.5)',
        borderRadius: '10px',
       
        
      }}
      
      hover>
      <tr>
    
      <td style={{ display: 'flex',
  flexDirection: 'column',
  alignItems: 'center'}}>
      <div style={inputContainerStyle}>
        <div>
          <label htmlFor="origin">Origin:</label>
          <Autocomplete
          onLoad={(autocomplete) => setOriginAutocomplete(autocomplete)}
          onPlaceChanged={() => handleOriginSelect(originAutocomplete.getPlace().formatted_address)}
        >
          <input
            id="origin"
            type="text"
            value={origin}
            onChange={handleOriginChange}
            style={inputStyle}
            placeholder="Enter origin"
          />
          </Autocomplete>
          {originError && <p style={{ color: 'red' }}>{originError}</p>}
        </div>
        <br></br>
        <div>
          <label htmlFor="destination">Destination:</label>
          <Autocomplete
          onLoad={(autocomplete) => setDestinationAutocomplete(autocomplete)}
          onPlaceChanged={() => handleDestinationSelect(destinationAutocomplete.getPlace().formatted_address)}
        >
          <input
            id="destination"
            type="text"
            value={destination}
            onChange={handleDestinationChange}
            style={inputStyle}
            placeholder="Enter destination"
          />
          </Autocomplete>
          {destinationError && <p style={{ color: 'red' }}>{destinationError}</p>}
        </div>
        <br></br>
        <label htmlFor="stop">Stop:</label><br></br>
        {waypoints.map((waypoint, index) => (
          <div key={index}>
            <label htmlFor={`waypoint-${index}`} style={{marginRight:30 }}>Stop {index + 1}:</label>
            <Autocomplete
              onLoad={(autocomplete) => {
                const newAutocompletes = [...waypointAutocompletes];
                newAutocompletes[index] = autocomplete;
                setWaypointAutocompletes(newAutocompletes);
              }}
              onPlaceChanged={() => handleWaypointSelect(waypointAutocompletes[index].getPlace().formatted_address, index)}
            >
            <input
              id={`waypoint-${index}`}
              type="text"
              value={waypoint.location}
              onChange={(e) => handleWaypointChange(e, index)}
              style={inputStyle}
              placeholder="Enter waypoint"
            />
            </Autocomplete>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <button onClick={() => handleDeleteWaypoint(index)} style={delStyle}>Delete</button>
          </div>
        ))}
        <button onClick={handleAddWaypoint} style={buttstyle}>Stop</button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <button onClick={handleCalculateClick} style={buttonStyle}>
          Calculate
        </button>
      </div>
      {distance !== null && (
      <div style={{ borderRadius:'25px', marginTop:30,padding: "10px", margin: "10px",width:"100%",background: 'rgba(255, 255, 255, 0.5)',
      backdropFilter: 'blur(2px)',marginLeft:100,
       }}>
        <Table>
          <tr>
            <td><h2 >Distance</h2></td>
            <td><h1 style={{marginLeft:400,color:'#4285F4'}}>{distance} kms</h1></td> 
          </tr>
        </Table>
        
        <div style={{ borderRadius:'25px', marginTop:30,padding: "10px", margin: "10px",width:"90%",background: 'rgba(255, 255, 255, 0.5)',
      backdropFilter: 'blur(2px)',
       }}>

        <p>The Distance between <b>{origin}</b> and <b>{destination}</b> via the selected route is <b>{distance}</b> kms.</p>
        </div> 
        
      </div>
     )}
     </td>

     <td style={{ height: '400px',
  width: '50%'}}>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={mapContainerStyle}>
          
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={center}
              zoom={12}
              options={options}
            >
              {directions && <DirectionsRenderer directions={directions} />}
              {waypoints.map((waypoint, index) => (
                <DirectionsService
                  key={index}
                  options={{
                    destination: waypoint.location,
                    travelMode: 'DRIVING'
                  }}
                  callback={(result, status) => {
                    if (status === 'OK') {
                      setDirections(result);
                    }
                  }}
                />
              ))}
            </GoogleMap>
            
        </div>
      </div>
      </td>

     </tr>
    </Table>
    </div>
    
  );
  
        }



export default App;
