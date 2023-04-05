import './styles/Twittersteam.scss';
import React, { useState, useEffect, useRef  } from 'react';
import io from 'socket.io-client';
import axios from 'axios'
import { Pie, Line, Bar } from "@ant-design/plots";
import { Radio, Statistic, Col, Row, Tooltip, Carousel,Modal } from 'antd';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay,faPause } from '@fortawesome/free-solid-svg-icons'
import { faTwitter } from "@fortawesome/free-brands-svg-icons"

const socket = io('http://localhost:4000');
// const back = "http://localhost:4000/api";

// const handleClick2 = (tweetData) => {
//   window.open = `https://twitter.com/${tweetData.username}/status/${tweetData.id}`;
// }
// function Tweet({ tweetData }) {
//   return (
//     <div className="tweet-blog" >
//         <div className="text">{tweetData.text}</div>
//         <div onClick={handleClick2(tweetData)} className="username">{tweetData.username} <button> <FontAwesomeIcon icon={faTwitter} /> </button></div>
//         {/* <a className="links" href={`https://twitter.com/${tweetData.username}/status/${tweetData.id}`}>
//         <FontAwesomeIcon icon={['fab', 'twitter']} />  Go To Tweet
//         </a> */}
//     </div>
//   )
// }


function TwitterStream() {
  const now = new Date();
  // const time = now.toLocaleTimeString('en-US', {hour12: true, hour: 'numeric', minute: 'numeric', second: 'numeric'});
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(false);

  const [tweets, setTweets] = useState([])
  const [count, setCount] = useState(0);
  const [tweetCount, setTweetCount] = useState(0);
  const [reTweetCount, setReTweetCount] = useState(0);
  const [toggle,setToggle] = useState(1);
  const [hashtag, setHashtag] = useState([{text:"#",value:0}])
  const [mention,setMention] = useState([{text:"@",value:0}])
  const [lang, setLang] = useState([])
  const [qandp, setQandp] = useState([])
  const [tandm, setTandm] = useState([])

  const [mostValueHashtag, setMostValueHashtag] = useState(null)

  // for chart
  const [chartData, setChartData] = useState([{ time: now,type:"tweet", count: 0 },{ time: now,type:"retweet", count: 0 }]);
  
  const queryParams = new URLSearchParams(window.location.search)
  const query = queryParams.get("q")
  // socket.on('connect',()=>{
  //       console.log('Connected...')
  //   })

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setTweets([]);
  //   }, 10000);
  //   return () => clearInterval(interval);
  // }, []);


  const handleClick2 = (tweetData) => {
    window.location.href = `https://twitter.com/${tweetData.username}/status/${tweetData.id}`;
  }
  function Tweet({ tweetData }) {
    return (
      <div className="tweet-blog" >
          <div className="text">{tweetData.text}</div>
          <div className="username">{tweetData.username} <a href={`https://twitter.com/${tweetData.username}/status/${tweetData.id}`} target="_blank" > <FontAwesomeIcon icon={faTwitter} /> </a></div>
          {/* <a className="links" href={`https://twitter.com/${tweetData.username}/status/${tweetData.id}`}> */}
          {/* <FontAwesomeIcon icon={['fab', 'twitter']} />  Go To Tweet */}
          {/* <FontAwesomeIcon icon={faTwitter} /> */}
          {/* </a> */}
      </div>
    )
  }

  // time
  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setTime(seconds => seconds + 1);
      }, 1000);
    } else if (!isActive && time !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, time]);

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  function handleToggleClick2() {
    if(toggle){
      setTime(0)
      setIsActive(true)
      socket.emit('message',query);
      setToggle(0)
    }else{
      setIsActive(false);
      // setTime(0)
      socket.disconnect();
      setToggle(1)
    }
  }

  const handleClose = () => {
      socket.close();
  };
  const check = () => {
    console.log("t&m",tandm)
  };

  // count
  socket.on('no', (no) => {
    setCount(no + 1);
    
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const nowTime = `${hours}:${minutes}:${seconds}`;
    let comp = count-reTweetCount
    if(comp>0){
      setChartData([...chartData, {time: nowTime,type:"tweet",count: comp},{time: nowTime,type:"retweet",count: reTweetCount}]);
    }
    else{
      setChartData([...chartData, {time: nowTime,type:"retweet",count: reTweetCount}]);
    }
    }
  )
  socket.on('re', (re) => {
    setReTweetCount(re + 1)
    }
  )
  // socket.on('tweet_count', (tweet_count) => {
  //   setTweetCount(tweet_count + 1)
  //   }
  // )

  socket.on('hashtag', (hashtag) => {
    setHashtag(hashtag)      
    }
  )
  socket.on('mention', (mention) => {
    setMention(mention)      
    }
  )
  socket.on('lang', (lang) => {
    setLang(lang)      
    }
  )
  socket.on('qandp', (qandp) => {
    setQandp(qandp)      
    }
  )
  socket.on('tandm', (tandm) => {
    setTandm(tandm)      
    }
  )
    
  socket.on('tweet', (tweet) => {
    const tweetData = {
      id: tweet.data.id,
      text: tweet.data.text,
      username: `@${tweet.includes.users[0].username}`,
      created: tweet.data.created_at,
      lang:tweet.data.lang, 
    }
    setTweets([tweetData, ...tweets]);
  })

  const statisticPieStream= {
    title: {
      content: '',
    },
    content: {
      offsetY: -15,
      content: 'Language',
    }
  }
  const labelPie = {
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
  return (
    <div className='twitterstream'>
      <div className='title' onClick={check}>{query} 
          <button onClick={handleToggleClick2}>{toggle ?<FontAwesomeIcon icon={faPlay}/>:<FontAwesomeIcon icon={faPause}/>} </button>
          {/* <Statistic className='timer' title="Time" value={formatTime(time)} valueStyle={{fontSize: '30px' }}/> */}
          <div className='timer-1'> { formatTime(time)}</div>
          {/* <div className='timer'>{formatTime(time)}</div> */}
      </div>
      <Row className='bigrow'>
        <Col className='left' span={14}>
            <div className="graph-title" style={{fontSize:"20px",textAlign:"left",paddingLeft:"20px",paddingTop:"50xp"}} >Tweet Volume</div>
            <Col className="realtime-graph" span={24}style={{height:"380px",paddingRight:"30px",paddingLeft:"30px",marginBottom:"10px"}}>
              <Line
                data={chartData}
                xField="time"
                yField="count"
                seriesField="type"
                smooth={true}
                // lineStyle={{lineWidth:"3",stroke:'#1DA1F2'}}
                // lineStyle={{lineWidth:"3",stroke:'#1DA1F2'}}
              />
            </Col>

            <Row>
              <Col span={12} style={{height:"180px",padding:"10px"}}>
                <Statistic title="All Tweet" value={count} valueStyle={{fontSize: '30px' }}/>
                <Row>
                  {/* <Col span={12} style={{padding:"20px"}}> */}
                  <Col span={12} >
                    <Statistic title="Tweet" value={count-reTweetCount} valueStyle={{fontSize: '30px' }}/>
                  </Col>
                  {/* <Col span={12} style={{padding:"20px"}}> */}
                  <Col span={12} >
                    <Statistic title="Retweet" value={reTweetCount} valueStyle={{fontSize: '30px' }}/>
                  </Col>
                </Row>
              </Col>

              {/* <Col span={12} style={{height:"180px",padding:"10px"}}>
                  <Col span={24} style={{padding:"0px"}} >
                    <Statistic title="Top Hashtag" value={count ? `${hashtag?.text} : ${hashtag?.value}`:"-"} valueStyle={{fontSize: '30px' }}/>
                  </Col>
                  <Col span={24} style={{padding:"20px"}} >
                    <Statistic title="Top Mention" value={count ? `${mention?.text} : ${mention?.value}`:"-"} valueStyle={{fontSize: '30px' }}/>
                  </Col>
              </Col> */}
              <Col span={12} style={{height:"180px"}}>
                <Row  style={{height:"90px"}}>
                  <Col span={12} >
                    <Statistic title="Reply" value={count ? `${qandp.reply}`:"0"} valueStyle={{fontSize: '30px' }}/>
                  </Col>
                  <Col span={12} >
                    <Statistic title="Quote" value={count ? `${qandp.quote}`:"0"} valueStyle={{fontSize: '30px' }}/>
                  </Col>
                </Row>
                <Row style={{height:"90px"}}>
                  <Col span={12} >
                    <Statistic title="text" value={count ? `${count - reTweetCount - tandm.media}`:"0"} valueStyle={{fontSize: '30px' }}/>
                  </Col>
                  <Col span={12} >
                    <Statistic title="Media" value={count ? `${tandm.media}`:"0"} valueStyle={{fontSize: '30px' }}/>
                  </Col>
                </Row>
              </Col>
              {/* <Row>
              <Col span={24} style={{backgroundColor:"teal"}}>
                <Col span={24} style={{backgroundColor:"teal"}}>
                test1
                </Col>
                <Col span={24} style={{backgroundColor:"teal"}}>
                test2
                </Col>
              </Col>
              <Col span={24} style={{backgroundColor:"yellow"}}>
                test3
              </Col>
              </Row> */}
    
            </Row>
            <Row>
              <Col span={12} style={{padding:"20px"}}>
                <Statistic title="Top Mention" value={count ? `${mention?.text} : ${mention?.value}`:"-"} valueStyle={{fontSize: '30px' }}/>
              </Col>
              <Col span={12} style={{padding:"20px"}}>
                <Statistic title="Top Hashtag" value={count ? `${hashtag?.text} : ${hashtag?.value}`:"-"} valueStyle={{fontSize: '30px' }}/>
              </Col>
            </Row>

            <Col span={24} style={{height:"360px",padding:"40px"}}>
            {/* <Pie className='pie-chart' data={PercentsLang} colorField='lang' angleField='value'
            innerRadius='0.55' label={label} interactions={interactions} statistic={statistic} legend={legend} 
            /> */}
              <Col span={24} style={{height:"280px"}}>
                <Pie 
                data={lang}
                height="200px"
                colorField='text' angleField='value'
                innerRadius='0.55'
                statistic={statisticPieStream}
                label={labelPie}
                />
              </Col>
            </Col>
        </Col>
        <Col className='tweet-col' span={10}>
          <div className='container-title'>Tweet</div>
          <div className="container">
              {tweets.map((tweetData) => <Tweet tweetData={tweetData} />)}
          </div>
        </Col>
        {/* under tweet */}
      </Row>
    </div>
  );
}

export default TwitterStream;

