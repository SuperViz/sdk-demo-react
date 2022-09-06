import { useState } from 'react'
import './App.css'
import SuperVizSdk, { MeetingEvent } from '@superviz/sdk'

const TOKEN = '<YOUR_TOKEN>'
const PROPERTY_NAME = 'message'
const ROOM_ID = 'dev-daily'
const GROUP_ID = 'test_demo'
const GROUP_NAME = 'Test Demo'

type SdkPayload = {
  message: string
}

function App() {
  const [userId, setUserId] = useState('')
  const [userName, setUserName] = useState('')
  const [message, setMessage] = useState('')
  const [openSdk, setOpenSdk] = useState(false)

  let sdk: any = null

  const initSdk = async () => {
    setOpenSdk(true)
    sdk = await SuperVizSdk.init(TOKEN, {
      userGroup: {
        id: GROUP_ID,
        name: GROUP_NAME,
      },
      user: {
        id: userId,
        isHost: true,
        name: userName,
        isHostCandidate: true,
      },
      roomId: ROOM_ID,
      shouldKickUsersOnHostLeave: true
    });
    sdk?.subscribe(PROPERTY_NAME, onSyncPropertyChange);
    sdk?.subscribe(MeetingEvent.MEETING_SAME_USER_ERROR, onSdkError);
  }

  const closeSdk = () => {
    setOpenSdk(false)
    sdk?.destroy()
  }

  const sendCustom = () => {
    sdk.setSyncProperty(PROPERTY_NAME, message)
  }

  const onSyncPropertyChange = (payload: SdkPayload) => {
    alert(`Message: ${payload}`)
  }

  const onSdkError = (error: any) => {
    console.log('onSdkError', error)
  }

  const handleUserIdChange = (event: any) => {
    setUserId(event.target.value)
  }

  const handleUserNameChange = (event: any) => {
    setUserName(event.target.value)
  }

  return (
    <div className="App">
      <h1>Superviz React Demo</h1>
      {!openSdk && (

        <div className="card">
          <input type="text" value={userId} placeholder="USER ID" onChange={handleUserIdChange} />
          <input type="text" value={userName} placeholder="USER NAME" onChange={handleUserNameChange} />
          <button onClick={() => initSdk()}>
            Init SDK
          </button>
        </div>
      ) || (
        <div className="card">
          <input type="text" value={message} placeholder="MESSAGE" onChange={(event) => setMessage(event.target.value)} />
          <button onClick={() => sendCustom()}>
            Send Custom Message
          </button>
        </div>
      )}
    </div>
  )
}

export default App
