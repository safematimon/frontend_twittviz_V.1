import './styles/Searchword.scss';
import {useState,useEffect,} from 'react'
import { useLocation,useNavigate} from 'react-router-dom'
import { Radio, Statistic, Col, Row, Tooltip, Carousel } from 'antd';
import axios from 'axios'
import ReactWordcloud from 'react-wordcloud';
import { Pie, Line, Bar } from "@ant-design/plots";
import { CSVLink } from "react-csv";
import { Tweet } from 'react-twitter-widgets'
import twitterIcon from './Icon/twitter-icon.png';
import { ComposableMap, Geographies, Geography,ZoomableGroup } from 'react-simple-maps';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileCsv, faChartSimple } from '@fortawesome/free-solid-svg-icons'

const back = "http://localhost:4000/api";
// const back = "https://backend-temp-liard.vercel.app/api";

const geoUrl = "https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json"


export function Searchword() {
  const Navigate = useNavigate();
  const [searchword,setSearchword] = useState('true')
  const [loading,setLoading] = useState(true)
  const [granularity,SetGranularity] = useState('day')
  const [countDataDay,setCountDataDay] = useState([])
  const [countDataHour,setCountDataHour] = useState([])
  const [countDataMin,setCountDataMin] = useState([])
  const [langData,setLangData] = useState([])
  const [langDataPercen,setLangDataPercen] = useState([])

  const [contextData,setContextData] = useState([])
  const [popularData3,setPopularData3] = useState(
    {highestRetweetCountId: '1445078208190291973',highestRetweetCount: 0, highestLikeCountId: '1445078208190291973', highestLikeCount: 0,
    highestReplyCountId: '1445078208190291973',highestReplyCount: 0,highestImpressionCountId: '1445078208190291973',highestImpressionCount: 0})

  const [tweetType,setTweetType] = useState([])
  const [sourceData,setSourceData] = useState([])
  const [publicData,setPublicData] = useState([])
  const [wordcloudData,setWordcloudData] = useState([])
  const [hashtagData,setHashtagData] = useState([])
  const [mentionData,setMentionData] = useState([])
  const [top5Domain,setTop5Domain] = useState()
  const [mediaData,SetMediaData] = useState([])
  const [location,setLocation] = useState()
  const [csvData,SetcsvData] = useState()

  const { state } = useLocation()
  
  const queryParams = new URLSearchParams(window.location.search)
  const query = queryParams.get("q")

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
    const queryParams = new URLSearchParams(window.location.search)
    const query = queryParams.get("q")
    const type = '1'
    setSearchword(query)
      axios.get(back+"/tweets",{
        params: {
          query,
          type
        }
      })
      .then(response =>{
        setLangData(response.data.lang)
        setPublicData(response.data.public_metrics)
        setSourceData(response.data.source)
        setWordcloudData(response.data.word)
        setHashtagData(response.data.hashtag)
        setMentionData(response.data.mention)
        // setContextData(response.data.context)
        setPopularData3(response.data.popular3)
        setTweetType(response.data.tweettype)
        setTop5Domain(response.data.top5)
        SetMediaData(response.data.media)
        setLocation(response.data.user_location)

      })
      .catch(error => console.log(error.message))

      let granularity = 'day'
      axios.get(back+"/counts",{
        params: {
          query,
          granularity,
        }
      })
      .then(response =>{
        let temp = response.data.data
        const day = temp.map(item => {
          const endDate = new Date(item.end);
          const startDate = new Date(item.start);
          return {
            end: `${endDate.getDate()}/${endDate.getMonth() + 1}`,
            start: `${startDate.getDate()}/${startDate.getMonth() + 1}`,
            tweet_count: item.tweet_count,
          }
        });
        setCountDataDay(day)
      })
      // 
      granularity = 'hour'
      axios.get(back+"/counts",{
        params: {
          query,
          granularity,
        }
      })
      .then(response =>{
        let temp = response.data.data
        const day = temp.map(item => {
          const endDate = new Date(item.end);
          const startDate = new Date(item.start);
          return {
            end: `${endDate.getHours()}:00 ${endDate.getDate()}/${endDate.getMonth() + 1}`,
            start: `${startDate.getHours()}:00 ${startDate.getDate()}/${startDate.getMonth() + 1}`,
            tweet_count: item.tweet_count,
          }
        });
        setCountDataHour(day)
      })
      // 
      granularity = 'minute'
      axios.get(back+"/counts",{
        params: {
          query,
          granularity,
        }
      })
      .then(response =>{
        let temp = response.data.data
        const day = temp.map(item => {
          const endDate = new Date(item.end);
          const startDate = new Date(item.start);
          return {
            end: `${endDate.getHours()}:${endDate.getMinutes()} ${endDate.getDate()}/${endDate.getMonth() + 1}`,
            start: `${startDate.getHours()}:${startDate.getMinutes()} ${startDate.getDate()}/${startDate.getMonth() + 1}`,
            tweet_count: item.tweet_count
          }
        });
        setCountDataMin(day)
      })
      .catch(error => console.log(error.message))
  },[state])

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search)
    const query = queryParams.get("q")
    const type = '2'
      axios.get(back+"/tweets",{
        params: {
          query,
          type
        }
      })
      .then(response =>{
        setLangData(response.data.lang)
        setPublicData(response.data.public_metrics)
        setSourceData(response.data.source)
        setWordcloudData(response.data.word)
        setHashtagData(response.data.hashtag)
        setMentionData(response.data.mention)
        // setContextData(response.data.context)
        setPopularData3(response.data.popular3)
        setTweetType(response.data.tweettype)
        setTop5Domain(response.data.top5)
        SetcsvData(response.data.csvData)
        SetMediaData(response.data.media)
        setLocation(response.data.user_location)

      })
      .catch(error => console.log(error.message))
  },[state])

  // handleTimeFrame
  const handleTimeFrame = (e) => {
    SetGranularity(e.target.value)
  };

  // donut lang 
  langData.sort((a, b) => b.value - a.value);
  const totalLang = langData.reduce((acc, { value }) => acc + Number(value), 0);
  const PercentsLang = langData.map(({ lang, value }) => ({
    lang,value: Number(((value/totalLang)* 100).toFixed(1)),
  }));
  // const langPercents = PercentsLang.sort((a, b) => b.value - a.value);
  // const otherLangTotal = PercentsLang.reduce((acc, { value }) => {
  //   if (value < 1) {
  //     acc += value;
  //   }
  //   return acc;
  // }, 0);
  // const otherLangObj = {
  //   // lang: "Other Languages",
  //   lang: "Other",
  //   value: Number(otherLangTotal.toFixed(1)),
  // };
  // const updatedLangPercents = PercentsLang.filter(({ value }) => value >= 1);
  // updatedLangPercents.push(otherLangObj);
  // not percen have outer ==========
  const otherLangTotal2 = langData.reduce((acc, { value }) => {
    if (value < 10) {
      acc += value;
    }
    return acc;
  }, 0);
  const otherLangObj2 = {
    lang: "Other",
    value: Number(otherLangTotal2),
  };
  const updatedLang = langData.filter(({ value }) => value >= 10);
  updatedLang.push(otherLangObj2);

  // donut context here
  contextData.sort((a, b) => b.value - a.value);
  const totalContext = contextData.reduce((acc, { value }) => acc + Number(value), 0);
  const PercentsContext = contextData.map(({ domain, value }) => ({
    domain,value: Number(((value/totalContext)* 100).toFixed(1)),
  }));
  const otherCTotal = PercentsContext.reduce((acc, { value }) => {
    if (value < 1) {
      acc += value;
    }
    return acc;
  }, 0);
  const otherCObj = {
    domain: "Other",
    value: Number(otherCTotal.toFixed(1)),
  };
  const updatedContextPercents = PercentsContext.filter(({ value }) => value >= 1);
  updatedContextPercents.push(otherCObj);
  // not percen have outer ==========
  const otherLangTotal21 = contextData.reduce((acc, { value }) => {
    if (value < 10) {
      acc += value;
    }
    return acc;
  }, 0);
  const otherLangObj21 = {
    domain: "Other",
    value: Number(otherLangTotal21),
  };
  const updatedContext = contextData.filter(({ value }) => value >= 10);
  updatedContext.push(otherLangObj21);

  const label = {
    type: "inner",
    offset: "-50%",
    style: {
      textAlign: "center",
      fontSize: 16,
      fill:'white'
    },
    autoRotate: false,
    // content : '',
    content: ({ percent }) => {
      if (percent >= 0.1) {
        return `${(percent * 100).toFixed(0)}%`;
      }
      return ` `;
    },
  }
  // hashtagData
  const label_bar1 = {
    position: 'middle',
    content: ({value}) => {
      if (value > 3) {
        return `${value}`;
      }
      return ``;
    },
    style: {
      fill:'black',
      opacity: 0.6,
    },
  }

  const statistic= {
    title: {
      offsetY: -20,
      content: '',
      style: {
        fontSize: 30,
      },
    },
    content: {
      offsetY: -15,
      style: {
        whiteSpace: 'pre-wrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      },
      content: 'Language %',
    }
  }

  const interactions = [
    {
      type: 'element-selected'
    },
    {
      type: "element-active"
    },
    // hover show value in center pie
    {
      // type: "pie-statistic-active"
    }
  ]

  const legend = {
    position: 'right',
    itemName:{
      style: {
        fontSize: 16,
      }
    }
  }
  // word cloud options size style
  const options = {
    rotations: 0,
    fontFamily: 'Verdana',
    fontSizes: [20,80],
    padding: 5,
  };
  
  const slider1 = {
    start: 0.005,
    end: 0.995,
  }
  const slider2 = {
    start: 0.85,
    end: 0.995,
  }
  const slider3 = {
    start: 0.418,
    end: 0.995,
  }

  let slider = slider1;
  if (granularity === "day") {
    slider = slider1;
  } else if (granularity === "hour") {
    slider = slider2;
  } else if (granularity === "minute") {
    slider = slider3;
  }

  const linestyle = {
    lineWidth: 3
  }

  const xAxis = {
  }

  const yAxis = {
    label: {
      formatter: (text) => {
        if (text.length <= 10) {
          return text;
        }
        return `${text.slice(0, 10)}...`;
      },
    }
  }

  const handleBtn = () => {
    const search = searchword.replace(/[#]/g, "%23");
    window.open(`https://twitter.com/search?q=${search}`, '_blank');
  }

  const gostream = (e) =>{
    // prevent # in stream
    var queryformatter = query.replace(/[#]/g,"%23")
    Navigate(`/stream?q=${queryformatter}`);
  }

  return (
    <div className={`search ${loading ? 'blur' : ''}`}>
      {loading &&
        <div className="loading-icon-container">
          <div className="loading-icon"></div>
        </div>
      }

      
    <div className={`container ${loading ? ' blur' : ''}`}  >
        <div className='title'>{searchword  } 
          {/* <CSVLink data={csvData} filename={`${query}.csv`}>   <FontAwesomeIcon icon={faFileCsv} /></CSVLink> */}
          <button className='btn-twitter' onClick={handleBtn}><img className='btn-icon' src={twitterIcon} alt="WorldIcon" /></button>
          <button className='stream' onClick={gostream}>In realtime <FontAwesomeIcon icon={faChartSimple}/></button>
        </div>
        <div className="line-graph-container">
          <div className="left-side">
            <div className='graph-title' >Tweet Volume</div>
            <div className='radio-container'>
              <Radio.Group className='radio' onChange={handleTimeFrame} buttonStyle="solid" value={granularity} >
                <Radio.Button value="minute">Min</Radio.Button>
                <Radio.Button value="hour">Hour</Radio.Button>
                <Radio.Button value="day">Day</Radio.Button>
              </Radio.Group>
            </div>
            <div className='graph-container'>
              <Line data={granularity === "day" ? countDataDay : (granularity === "hour" ? countDataHour : countDataMin)} xField='end' yField='tweet_count' 
              lineStyle={linestyle} xAxis={xAxis} slider={slider} />
            </div>
          </div>
          <div className="right-side">
            <Col span={24} style={{height:"25%"}}>
              <Statistic
              title={
                <Tooltip placement="top" title='Sample Tweet from query topic' showArrow={false} >
                  <div className="title-statistic">Sample Tweet</div>
                </Tooltip>}
              value={tweetType.size} valueStyle={{fontSize: '30px' }}/>
            </Col>
            <Row style={{height:"25%"}}>
              <Col span={8}>
                <Statistic
                title={
                  <Tooltip placement="top" title='Original Tweet' showArrow={false} >
                    <div className="title-statistic">Tweet</div>
                  </Tooltip>}
                value={tweetType.tweet} valueStyle={{fontSize: '30px' }}/>
              </Col>
              <Col span={8}>
                <Statistic
                title={
                  <Tooltip placement="top" title='Tweet that includes another tweet' showArrow={false} >
                    <div className="title-statistic">Quote</div>
                  </Tooltip>}
                value={tweetType.quote} valueStyle={{fontSize: '30px' }}/>
              </Col>
              <Col span={8}>
                <Statistic
                title={
                  <Tooltip placement="top" title='Tweet in response to another tweet' showArrow={false} >
                    <div className="title-statistic">Reply</div>
                  </Tooltip>}
                value={tweetType.reply} valueStyle={{fontSize: '30px' }}/>
              </Col>
            </Row>
            <Row style={{height:"25%"}}>
              <Col span={12}>
                <Statistic
                title={<div className="title-statistic">Text Tweet</div>}
                value={tweetType.text} valueStyle={{fontSize: '30px' }}/>
              </Col>
              <Col span={12}>
                <Statistic
                title={<div className="title-statistic">Media Tweet</div>}
                value={tweetType.media} valueStyle={{fontSize: '30px' }}/>
              </Col>
            </Row>
            <Row style={{height:"25%"}}>
              <Col span={12} style={{height:"20%"}}>
                <Statistic 
                title={<div className="title-statistic">Image</div>}
                value={tweetType.photosCount} valueStyle={{fontSize: '30px' }}/>
              </Col>
              <Col span={12} style={{height:"20%"}}>
                <Statistic 
                title={<div className="title-statistic">Video</div>}
                value={tweetType.videosCount} valueStyle={{fontSize: '30px' }}/>
              </Col>
            </Row>
          </div>
        </div>
      <div className="pie-graph-container">
        <div className="pie-column1" >
          <Pie className='pie-chart' data={PercentsLang} colorField='lang' angleField='value'
          innerRadius='0.55' label={label} interactions={interactions} statistic={statistic} legend={legend} 
          />
        </div>
        <div className="pie-column2" >
            <Row style={{height:"16%"}}>
              <Col span={24} style={{fontSize:"26px"}}>
                  Content Description
              </Col>
            </Row>
            <Row style={{height:"21%"}}>
              <Col span={24}>
                  <Statistic
                  title={top5Domain?.[0].name}
                  value={`${top5Domain?.[0].entities[0]?.name} ${((top5Domain?.[0].entities[0]?.value/top5Domain?.[0].count)*100).toFixed(1)}%`} valueStyle={{fontSize: '24px' }}/>
              </Col>
            </Row>
            <Row style={{height:"21%"}}>
              <Col span={24}>
                  <Statistic
                  title={top5Domain?.[1].name}
                  value={`${top5Domain?.[1].entities[0]?.name} ${((top5Domain?.[1].entities[0]?.value/top5Domain?.[1].count)*100).toFixed(1)}%`} valueStyle={{fontSize: '24px' }}/>
              </Col>
            </Row>
            <Row style={{height:"21%"}}>
              <Col span={24}>
                  <Statistic
                  title={top5Domain?.[2].name}
                  value={`${top5Domain?.[2].entities[0]?.name} ${((top5Domain?.[2].entities[0]?.value/top5Domain?.[2].count)*100).toFixed(1)}%`} valueStyle={{fontSize: '24px' }}/>
              </Col>
            </Row>
            <Row style={{height:"21%"}}>
              <Col span={24}>
                  <Statistic
                  title={top5Domain?.[3].name}
                  value={`${top5Domain?.[3].entities[0]?.name} ${((top5Domain?.[3].entities[0]?.value/top5Domain?.[3].count)*100).toFixed(1)}%`} valueStyle={{fontSize: '24px' }}/>
              </Col>
            </Row>
        </div>
      </div>
      {location &&
      <Col className='map-con' >
        <h1>User location</h1>
        <ComposableMap data-tip=""
          className='map-component'
          projection="geoMercator"
          style={{
            backgroundColor:"#5F8EAD",
            // width:'700px',
            // height:'400px',
            minWidth:"320px",
            // minHeight:"650px",
            maxWidth:"1200px",
            maxHeight:"400px",
            border:"solid",
            borderRadius:"5px",
            borderWidth:"2px"
          }}
          projectionConfig={{
            scale: 220,
            center: [12,10],
          }}
        >
          <ZoomableGroup 
            // zoom={2.5} 
            // center={[99, 11]}
          >
          <Geographies geography={geoUrl}
          >
            {({ geographies }) =>
              // ===========================================================================
              geographies.map((geo) => {
                  const check = location.find((item) => item === geo.properties.name);
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={check ? "#62daab" : "white"}
                    style={{
                          default: {
                            stroke: "#111111",
                            strokeWidth: 0.5,
                            outline: "none"
                          }
                        }}
                  />
                );
              })
            }
          </Geographies>
          </ZoomableGroup>
        </ComposableMap> 
      </Col>
      }

      <div className="tweet-container">
        <div className="parent-con">
          <div className="con">
            <div className="info">Most Retweet</div>
            <div className="info">{popularData3.highestRetweetCount} Retweets</div>
            <div className="example" >
              <Tweet tweetId={popularData3.highestRetweetCountId} />
            </div>
          </div>
          <div className="con">
            <div className="info">Most like</div>
            <div className="info">{popularData3.highestLikeCount} Likes</div>
            <div className="example" >
              <Tweet  tweetId={popularData3.highestLikeCountId} />
            </div>
          </div>
        </div>
        <div className="parent-con" >
          <div className="con">
            <div className="info">Most Reply</div>
            <div className="info">{popularData3.highestReplyCount} Reply Tweets</div>
            <div className="example" >
              <Tweet  tweetId={popularData3.highestReplyCountId} />
            </div>
          </div>
          <div className="con">
            <div className="info">Most View</div>
            <div className="info">{popularData3.highestImpressionCount} Views</div>
            <div className="example" >
              <Tweet  tweetId={popularData3.highestImpressionCountId} />
            </div>
          </div>
        </div>
      </div>

      <div className="bar-graph-container">
      <div className="bar-column1">
          <div className='title-bar' >Top Hashtag</div>
          <Bar data={hashtagData} xField='value' yField='text' barWidthRatio={0.7}
          seriesField='type'  isStack={true} annotation
          legend={false} label={label_bar1} yAxis={yAxis} />
          {/* <Column data={hashtagData} xField='text' yField='value' columnWidthRatio={0.7} 
          seriesField='type' isStack={true} legend={false} xAxis={yAxis} label={label_col} /> */}
        </div>
        <div className="bar-column2">
            <div className='title-bar' >Top Mention</div>
            <Row style={{height:"80px"}}>
              <Col span={16}>
                <div >
                  <img src={mentionData?.[0]?.profile_image_url} />{'@'+mentionData?.[0]?.username}
                </div>
              </Col >
              <Col span={8} >
                <span >{mentionData?.[0]?.value} mentions</span>
              </Col>
            </Row>
            <Row style={{height:"80px"}}>
              <Col span={16}>
                <div >
                  <img src={mentionData?.[1]?.profile_image_url} />{'@'+mentionData?.[1]?.username}
                </div>
              </Col >
              <Col span={8} >
                <span >{mentionData?.[1]?.value} mentions</span>
              </Col>
            </Row>
            <Row style={{height:"80px"}}>
              <Col span={16}>
                <div >
                  <img src={mentionData?.[2]?.profile_image_url} />{'@'+mentionData?.[2]?.username}
                </div>
              </Col >
              <Col span={8} >
                <span >{mentionData?.[2]?.value} mentions</span>
              </Col>
            </Row>
            <Row style={{height:"80px"}}>
              <Col span={16}>
                <div >
                  <img src={mentionData?.[3]?.profile_image_url} />{'@'+mentionData?.[3]?.username}
                </div >
              </Col >
              <Col span={8} >
                <span >{mentionData?.[3]?.value} mentions</span>
              </Col>
            </Row>
            <Row style={{height:"80px"}}>
              <Col span={16}>
                <div >
                  <img src={mentionData?.[4]?.profile_image_url} />{'@'+mentionData?.[4]?.username}
                </div>
              </Col >
              <Col span={8} >
                <span >{mentionData?.[4]?.value} mentions</span>
              </Col>
            </Row>
          {/* <div className='title-bar' >Top Mention</div> */}
          {/* <Bar data={mentionData} xField='value' yField='text' seriesField='text' barWidthRatio={0.7}
          legend={false} label={label_bar2} yAxis={yAxis} /> */}
          {/* <Column data={mentionData} xField='text' yField='value' columnWidthRatio={0.7} color='text'
          legend={false} xAxis={yAxis} label={label_col} /> */}
        </div>
      </div>
      <div className='wordcloud-con'>
        <div className='title-wordclod' >WordCloud</div>
        <ReactWordcloud className='wordcloud'  words={wordcloudData} options={options}/>
      </div>
      <Col className='img-con' >
        <h1>Image gallery</h1>
        <Carousel autoplay>
          {mediaData .map((item) => (
              <img src={item.url} alt={item.view} />
          ))}
        </Carousel>
      </Col>
      </div>
    </div>
  );
}
