// import './App.css';
import './styles/Map.scss'
import {useState,useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Modal, Table, Badge } from 'antd';

import { ComposableMap, Geographies, Geography, ZoomableGroup} from "react-simple-maps"
import ReactTooltip from 'react-tooltip';

const { Column } = Table;

const geoUrl =
  "https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json"

const back = "http://localhost:4000/api";
// const back = "https://backend-temp-liard.vercel.app/api";

export function Map() {
  const [trends,setTrends] = useState([])
  const [woeid,setWoeid] = useState('1')

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading,setLoading] = useState(true)

  const [country,setCountry] = useState("")
  const Navigate = useNavigate();

  const countries = [
    { name: "Algeria", woeid: "23424740"},
    { name: "Argentina", woeid: "23424747"},
    { name: "Austria", woeid: "23424750"},
    { name: "Bahrain", woeid: "23424753"},
    { name: "Belarus", woeid: "23424765"},
    { name: "Belgium", woeid: "23424757"},
    { name: "Benin", woeid: "1387660"},
    { name: "Brazil", woeid: "23424768"},
    { name: "Canada", woeid: "23424775"},
    { name: "Chile", woeid: "23424782"},
    { name: "Colombia", woeid: "23424787"},
    { name: "Denmark", woeid: "23424796"},
    { name: "Dominican Republic", woeid: "23424800"},
    { name: "Ecuador", woeid: "23424801"},
    { name: "Egypt", woeid: "23424802"},
    { name: "France", woeid: "23424819"},
    { name: "Germany", woeid: "23424829"},
    { name: "Ghana", woeid: "23424824"},
    { name: "Greece", woeid: "23424833"},
    { name: "Guatemala", woeid: "23424834"},
    { name: "India", woeid: "23424848"},
    { name: "Indonesia", woeid: "23424846"},
    { name: "Ireland", woeid: "23424803"},
    { name: "Israel", woeid: "23424852"},
    { name: "Italy", woeid: "23424853"},
    { name: "Japan", woeid: "23424856"},
    { name: "Jordan", woeid: "23424860"},
    { name: "Kenya", woeid: "23424863"},
    { name: "Kuwait", woeid: "23424870"},
    { name: "Latvia", woeid: "23424874"},
    { name: "Lebanon", woeid: "23424873"},
    { name: "Malaysia", woeid: "23424901"},
    { name: "Mexico", woeid: "23424900"},
    { name: "Netherlands", woeid: "23424909"},
    { name: "Nigeria", woeid: "23424908"},
    { name: "Norway", woeid: "23424910"},
    { name: "Oman", woeid: "23424898"},
    { name: "Pakistan", woeid: "23424922"},
    { name: "Panama", woeid: "23424924"},
    { name: "Peru", woeid: "23424919"},
    { name: "Philippines", woeid: "23424934"},
    { name: "Poland", woeid: "23424923"},
    { name: "Portugal", woeid: "23424925"},
    { name: "Qatar", woeid: "23424930"},
    { name: "Russia", woeid: "23424936"},
    { name: "Saudi Arabia", woeid: "23424938"},
    { name: "Singapore", woeid: "23424948"},
    { name: "South Africa", woeid: "23424942"},
    { name: "South Korea", woeid: "23424868"},
    { name: "Spain", woeid: "23424950"},
    { name: "Sweden", woeid: "23424954"},
    { name: "Switzerland", woeid: "23424957"},
    { name: "Thailand", woeid: "23424960"},
    { name: "Turkey", woeid: "23424969"},
    { name: "Ukraine", woeid: "23424976"},
    { name: "United Arab Emirates", woeid: "23424738"},
    { name: "United Kingdom", woeid: "23424975"},
    { name: "United States", woeid: "23424977"},
    { name: "United States of America", woeid: "23424977"},
    { name: "Venezuela", woeid: "23424982"},
    { name: "Vietnam", woeid: "23424984"},
  ];

  useEffect(() => {
    if(woeid !==0 ){
      axios.get(back+"/trends",{
        params: {
          woeid,
        },
      })
      .then(response =>{
        const responseSort = response.data[0].trends.map((obj, index) => {
          return {
            ...obj,
            no: index + 1
          };
        });
        setTrends(responseSort)
        setLoading(false)
      })
      .catch(error => console.log(error.message))
    }
  },[woeid])

  const handletrendclick = (e) =>{
    // prevent # in trend
    var trend = e.currentTarget.dataset.id.replace(/[#]/g,"%23")
    Navigate(`/search?q=${trend}`);
  }

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const options = { day: 'numeric', month: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric' };
  const formattedDateTime = new Date().toLocaleString('en-GB', options);

  return (
    <div className="map">

      <div className='description' >
        <Badge className='dot' color='grey' text="Available" />
        <Badge className='dot' color='white' text="Unavailable" />
      </div>
      
      <ReactTooltip className='tooltip' textColor="white" place="top,bottom">{country}</ReactTooltip>
        <ComposableMap data-tip=""
          className='map-component'
          // projection="geoEqualEarth"
          projection="geoMercator"
          // projection="geoAzimuthalEqualArea"
          // projection="geoOrthographic"
          // projection="geoMercator"
          style={{
            backgroundColor:"#5F8EAD"
          }}
      >
          <ZoomableGroup 
            zoom={2.5} 
            center={[99, 11]}
          >
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              // ===========================================================================
              geographies.map((geo) => {
                  const check = countries.find((item) => item.name === geo.properties.name);
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={check ? "white" : "#C9C9C9"}
                    style={{
                          default: {
                            stroke: "#111111",
                            strokeWidth: 0.5,
                            outline: "none"
                          },
                          hover: {
                            stroke: "#366BD1",
                            strokeWidth: 2,
                            outline: "none"
                          },
                          pressed: {
                            fill: "#ECEFF1",
                            stroke: "#607D8B",
                            strokeWidth: 0.75,
                            outline: "none"
                          }
                        }}
                        onClick={()=>{
                          var result = countries.find(item => item.name === geo.properties.name);
                          if(result){
                            setWoeid(result.woeid)
                          }
                          else{
                            setWoeid(0)
                          }  
                          setIsModalOpen(true)
                        }}
                        onMouseEnter={() => {
                          setCountry(geo.properties.name)
                        }}
                  />
                );
              })
              // ==============================================================================
            }
          </Geographies>
          </ZoomableGroup>
        </ComposableMap>
        {woeid ? 
        <Modal className='modal' title={`${country}\n${formattedDateTime}`} 
        open={isModalOpen} onOk={handleOk} onCancel={handleCancel} footer={null} >
          <Table dataSource={trends} loading={loading} rowKey="no">
            <Column title="No" dataIndex="no" key="no" width="10%" sorter={(a, b) => a.no - b.no}/>
            <Column title="Content" dataIndex="name" key="name" width="65%" sorter={(a, b) => a.name.localeCompare(b.name)}
              render={(text) => ( <p data-id={text} onClick={handletrendclick}> {text} </p>)}
            />
            <Column title="Volume" dataIndex="tweet_volume" key="tweet_volume" width="25%" 
            render={(text) => (text !== null ? text : "< 10K tweets")}
            sorter={(a, b) => b.tweet_volume - a.tweet_volume}/>
          </Table> 
        </Modal>
        :
        <div></div>
        // <Modal title={country} open={isModalOpen} onOk={handleOk} onCancel={handleCancel} footer={null} >
        //   <h1>this country no woeid</h1>
        // </Modal>
        }
      </div>
  );
}