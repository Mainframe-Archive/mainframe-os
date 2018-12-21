import React, { Component } from 'react'
import MainframeSDK from '@mainframe/sdk'

const sdk = new MainframeSDK()
window.sdk = sdk

class App extends Component {
  state = {
    url: null,
  }

  onClick = async () => {
    try {
      const name = 'avatar.jpg'
      await sdk.storage.requestUpload({name: name})
      this.setState({url: `app-file://${name}`})
    }
    catch(error) {
      console.log(error, 'error')
    }
 }

  render() {
    const { url } = this.state

    return (
      <div>
        <button onClick={this.onClick}>Upload Image</button>
        <br/>
        {url ? <img src={url} /> : null}
      </div>
    )
  }
}

export default App
