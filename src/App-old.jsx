import React, { Component } from 'react'
import { PubNubProvider } from 'pubnub-react'
import PubNub from 'pubnub'
import './App.css'
import DownGoose from './DownGoose'

class App extends Component {
  constructor(props) {
    super(props);
    this.pubnub = new PubNub({
      publishKey: import.meta.env.VITE_PUBNUB_PUBLISH_KEY,
      subscribeKey: import.meta.env.VITE_PUBNUB_SUBSCRIBE_KEY,
      uuid: "someUniqueKeyHere"
    });
  }

  render() {
    return (
      <PubNubProvider client={this.pubnub}>
        <DownGoose
          pubnub={this.pubnub}
        />
      </PubNubProvider>
    );
  }
}

export default App
