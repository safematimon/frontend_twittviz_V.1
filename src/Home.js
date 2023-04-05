// import './App.css';
import './styles/Home.scss'
import {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import { Table, Slider} from 'antd';
import axios from 'axios'

const back = "http://localhost:4000/api";
// const back = "https://backend-temp-liard.vercel.app/api";

const { Column } = Table;

export function Home() {
  const [trends,setTrends] = useState([])
  const [trends24,setTrends24] = useState([])
  const [timeframe,SetTimeframe] = useState(0)
  const [loading,setLoading] = useState(true)

  const Navigate = useNavigate();
  const woeid = '1';

  useEffect(()=> {
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
  },[woeid])

  useEffect(()=> {
    if(timeframe !==0){
      axios.get(back+"/past",{
        params: {
          timeframe,
        }
      })
      .then(response =>{
      setTrends24(response.data.data)
      })
      .catch(error => console.log(error.message))
    }
  },[timeframe])

  useEffect(() => {
    let interval = setInterval(() => {
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
    // }, 10000);
    }, 30000);
    // }, 600000);
    return () => {
      clearInterval(interval);
    };
  }, [woeid]);
  
  const handletrendclick = (e) =>{
    // prevent # in trend
    var trend = e.currentTarget.dataset.id.replace(/[#]/g,"%23")
    Navigate({
      pathname: 'search',
      search: `?q=${trend}`
    },{ state: trend });
  }

  const SliderMarks = {
    0: {
      style: {
        fontSize: "18px",
        color: "Black",
        paddingTop:"5px"
      },
      label: "Now"
    },
    6: "6Hr ago",
    12: "12Hr ago",
    18: "18Hr ago",
    24: {
      style: {
        fontSize: "16px",
        color: "Black",
        paddingTop:"7px"
      },
      label: "yesterday"
    },
    25: "2d",
    26: "3d",
    27: "4d",
    28: "5d",
    29: "6d",
    30: {
      style: {
        fontSize: "16px",
        color: "Black",
        paddingTop:"7px"
      },
      label: "7day ago"
    },
  };
  const SliderMarks2 = {
    0: {
      style: {
        fontSize: "18px",
        color: "Black",
        paddingTop:"5px"
      },
      label: "Now"
    },
    6: "6Hr ago",
    12: "12Hr ago",
    18: "18Hr ago",
    24: {
      style: {
        fontSize: "16px",
        color: "Black",
        paddingTop:"7px"
      },
      label: "yesterday"
    }
  };

  return (
    <div className="home">
      {/* <div style={{ backgroundColor:'teal',width: '1000px', height: '1000px' }}>
		    <TagCloud tagName={tagName} speed='0.5'radius='200' ></TagCloud>
		  </div> */}
      <div className='topic'>Twitter World Trends</div>

      {/* <div className='slider-wrap'>
        <Slider className='slider' min={0} max={30} marks={SliderMarks} defaultValue={0} onChange={SetTimeframe} value={timeframe} />
      </div> */}
      {/* reverse={true} */}
      <div className='slider-wrap'>
        <Slider className='slider' min={0} max={30} marks={SliderMarks} defaultValue={0} onChange={SetTimeframe} value={timeframe} />
      </div>
      <div className='slider-wrap2'>
        <Slider className='slider2' min={0} max={24} marks={SliderMarks2} defaultValue={0} onChange={SetTimeframe} value={timeframe} />
      </div>

      <h1>{(timeframe === 0) ? `Trend at : Now` : (timeframe<=24 ? `Trend at : ${timeframe} Hour ago` : `Trend at : ${timeframe-23} Day ago`)}</h1>
      
      <div className='table-wrap'>
      {timeframe === 0 ? 
      <Table dataSource={trends} loading={loading} rowKey="url" verticalAlign='middle'>
        <Column title="No" dataIndex="no" key="no" width="10%" align="center" sorter={(a, b) => a.no - b.no}/>

        <Column title="Name" dataIndex="name" key="name" width="70%" sorter={(a, b) => a.name.localeCompare(b.name)}
          render={(text) => ( <p data-id={text} onClick={handletrendclick}> {text} </p>)}
        />

        <Column title="Tweet volume" dataIndex="tweet_volume" key="tweet_volume" width="20%" 
        render={(text) => (text !== null ? text : "< 10K tweets")}
        sorter={(a, b) => b.tweet_volume - a.tweet_volume}/>
      </Table> 
      : 
      <Table dataSource={trends24} loading={loading} rowKey="no">
        <Column title="No" dataIndex="no" key="no" width="10%" align="center" sorter={(a, b) => a.no - b.no}/>
        <Column title="Name" dataIndex="name" key="name" width="70%" sorter={(a, b) => a.name.localeCompare(b.name)}
          render={(text) => ( <p data-id={text} onClick={handletrendclick}> {text} </p>)}
        />
        <Column title="Tweet volume" dataIndex="tweet_volume" key="tweet_volume" width="20%" 
        render={(text) => (text !== null ? text : "< 10K tweets")}
        sorter={(a, b) => b.tweet_volume - a.tweet_volume}/>
      </Table>
      }
      </div>
    </div>
  );
}

