/*
  Author: Zach Burnaby
  Project: DownGoose
  Date: 10.15.2022
*/

import React, {useState, useEffect} from 'react'
import PubNub from 'pubnub'
import { PubNubProvider, usePubNub } from 'pubnub-react'
import DownGoose from './DownGoose';
import './App.css'

const pubnub = new PubNub({
  publishKey: import.meta.env.VITE_PUBNUB_PUBLISH_KEY,
  subscribeKey: import.meta.env.VITE_PUBNUB_SUBSCRIBE_KEY,
  uuid: 'myUniqueUUID'
});

export default function App() {
  return (
    <PubNubProvider client={pubnub}>
      <DownGoose />
    </PubNubProvider>
  )
}
