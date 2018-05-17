// @flow
import React, { Component } from 'react'
import path from 'path'
import url from 'url'

export default class App extends Component {

  render() {
    const { appId } = this.props
    const appUrl = url.format({
      pathname: path.join(__static, 'applications', appId, `${appId}.asar`, `index.html`),
      protocol: 'file:',
      slashes: true
    })
    const preloadPath = url.format({
      pathname: path.join(__static, 'preload.js'),
      protocol: 'file:',
      slashes: true
    })
    return (
      <div>
        <h1>App Container</h1>
        <webview id="foo" src={appUrl} preload={preloadPath}></webview>
      </div>
    )
  }
}
