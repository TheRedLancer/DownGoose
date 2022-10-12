import { usePubNub } from 'pubnub-react'
import React, { useState, useEffect } from 'react'

export default function DownGoose() {
  const pubnub = usePubNub();
  const [channels] = useState([]);
  return (
    <div>DownGoose</div>
  )
}
