import React, { Component } from "react";
//import logo from './logo.svg';
import "./App.css";
import LineChart from "./LineChart";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasData: false,
      data: null
    }
  }

  componentDidMount() {
    const getData = () => {
      const proxyurl = "https://cors-anywhere.herokuapp.com/";
      const url = 'https://api.cryptowat.ch/markets/gdax/btcusd/ohlc';
      // const url = 'https://api.coindesk.com/v1/bpi/historical/close.json';

      fetch(proxyurl + url).then( r => r.json())
      .then((bitcoinData) => {
        const sortedData = [];
        var data = bitcoinData.result[60];
        for(var i=0; i < data.length; i++){
          //console.log(i + " " +bitcoinData.result[60][i][4]);
          sortedData.push({
            //d: moment(date).format('MMM DD'),
            //p: bitcoinData.bpi[date].toLocaleString('us-EN',{ style: 'currency', currency: 'USD' }),
            x: i, //previous days
            //y: bitcoinData.bpi[date] // numerical price
            y: data[i][4]
          });
        }
        
        this.setState({
          data: sortedData,
          hasData: true
        })
      })
      .catch((e) => {
        console.log(e);
      });
  }
  getData();
  }

  render() {
    return (
      <div className="App">
        <div className="header">Bitcoin</div>
        { this.state.hasData ?
        <LineChart data={this.state.data} /> :
        null}
      </div>
    );
  }
}

export default App;
