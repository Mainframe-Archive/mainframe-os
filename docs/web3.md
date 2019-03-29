---
id: web3
title: Web3 Notes
sidebar_label: Web3 Notes
---

Web3 recently made a breaking change where it rejects the use of custom providers, which affected us as we use a custom provider in Mainframe OS. There has been a bit of backlash from Truffle and Embark and looks like will be rolling back, but still means we can’t use Web3 1.0.0-beta-38 - 41 in any of our apps with our current provider setup. 
<br/>
<br/>
See: https://github.com/ethereum/web3.js/issues/2266

![](/img/web3_issue.png)
  