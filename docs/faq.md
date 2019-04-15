---
id: faq
title: Mainframe OS FAQ
sidebar_label: FAQ
---

## Introducing… Mainframe OS!

#### What is Mainframe OS?
Mainframe OS is a platform for end users to find and use dapps, and for developers to build and deploy dapps. Mainframe OS provides users with the elegant and cohesive UI comforts they have come to expect from a modern platform. Users can manage identity, wallets, contacts, and other security features in a single, integrated experience.

Mainframe OS takes care of all underlying web3 infrastructure and services, removing friction and making blockchain functionality accessible and seamless.

#### What is a decentralized app?
We define “dapp” a little differently than most. These days, any web application that interacts with a blockchain or smart contract is called a “dapp”. While the blockchain transactions and data store for those dapps might indeed be decentralized, the application itself is not. You still have to go to a centralized website to access it, and running inside a browser there is very little transparency into other sites accessed or data transferred while you’re there.

We believe that an application is only truly decentralized if it doesn’t live on a web server, can’t be accessed through a traditional browser, doesn’t store anything in a centralized database, and gives users full control over their own data and visibility into what’s happening behind the scenes.

#### Is Mainframe OS really an operating system?
No, it’s not an operating system in the standard sense. It is actually an application that is available on MacOS (other platforms supported soon). You can download from MainframeOS.com.

We call it an OS because 1) it has system-level utilities similar to other OS’s (namely integrated decentralized identity, contacts, and wallets), and 2) once you install and run Mainframe OS, you can then discover, install, and run dapps within that environment. So it is essentially an Operating System for your decentralized experience.

#### How do you use Mainframe OS?
The installation process is two steps. First you’ll have to setup your environment, then you can install the application. Don’t worry, we’ll guide you through it.

Once Mainframe OS is installed, users are guided through a simple and elegant onboarding experience. You’ll set up your vault password, your identity, and your wallet (you can create a new one, or import an existing Ethereum wallet).

That’s it. Now you’re ready to use Mainframe OS. First, explore the system utilities, connect with other Mainframe OS users, create or import additional wallets, and view/edit settings.

Next, it’s time to use some dapps. Mainframe OS comes pre-built with several dapps. Some are intended for exploration, inspiration, and reference. Others give access to cutting-edge defi protocols. Access your installed dapps and Mainframe’s “Suggested Apps” from the Applications tab. They are simple to install, use, and update.

#### What dapps are included with Mainframe OS?
There are seven “suggested apps” included currently in Mainframe OS.

Produced by Mainframe
CDP-Pro: arguably the easiest way to create and manage a MakerDAO CDP.
Compounded: arguably the easiest way to access Compound’s protocols to earn interest on ETH or DAI.
Payments: a simple app that facilitates sending ETH or MFT to integrated contacts
Noted: a text editor that stores encrypted notes in the decentralized Swarm network

Produced by Nonsense Tech (winners of our recent Dapp Developer Bounties Challenge and featured partners [here])
CDP Portal: the popular MakerDAO CDP dapp, ported to Mainframe OS
Uniswap: the popular exchange dapp, ported to Mainframe OS
The Looper: leverage your assets (based on Instadapp leverage functionality)

#### What makes Mainframe OS different?
One of our primary goals is to simplify the end-user experience especially for users who don't already know how to or don't regularly use dapps in a browser environment. Yes, there is an extra step to have them install the Mainframe OS application first and then your dapp inside it. But we try to make that simple and a better experience for them than the current norm of using a browser plus wallet extension (like chrome & metamask). Plus uses have a much more secure and private environment since all their data lives encrypted on their own machine, there are no connections to external endpoints without their explicit knowledge and permission, and only trusted dapps can be run in the sandboxed environment.

#### How does Mainframe OS compare to a Browser with Metamask?
Metamask is definitely the dominant paradigm currently for running dapps so we are indeed focused on improving the user experience while at the same time trying to still follow some standards they've set and not reduce available functionality without very good reason. We believe the end-user experience is better using Mainframe OS because 1) users don't have to know about or install a browser extension, 2) they setup their identity and wallet in a very streamlined onboarding flow, 3) we have contact functionality built-in at the system level so users can own their own social networks and contact data and make it available to dapps in a controlled way, 4) we are not running dapps in a browser so as mentioned before they are more unstoppable, trustful, and privacy-driven, and 5) through our SDK APIs, we can have control over blockchain transactions so can help guide users through complexities of gas, signing, verifying, approving, etc.

In Metamask, one of the major pain points is signing the transaction every time someone does anything. Currently we do require the same thing, but it feels a lot less cumbersome and more streamlined in Mainframe OS. And as we continue to improve our own blockchain APIs and eventually offer something better than Web3 js in the SDK, we could make it easier to batch sign transactions or streamline common flows like approve and transferFrom etc.

#### What makes Mainframe dapps unstoppable?
Dapps are not published or accessed in the traditional way from a web server that is vulnerable to attack and is a single point of failure. Once a dapp is published in Mainframe OS, it's out there in the immutable decentralized Swarm network and cannot be “stopped” (i.e. deleted, censored, blocked, etc). We provide a mechanism for dapp developers to deploy updates to a published dapp and for users to easily upgrade, but even then, the old versions actually are still out there.

#### What is a “sandboxed environment” and how does that guarantee privacy and trust?
A Sandboxed Environment means Mainframe Apps run inside a window controlled by Mainframe OS. As such, we can intercept any http requests, and provide tight integration between the Mainframe OS SDK APIs and the dapp UI. At the top of the app windows is a title bar and the “Trusted UI” bar. Anything displayed in this area comes directly from Mainframe OS and dapps do not have access to it. This is where your app permissions alerts, contacts, wallets, and blockchain alerts are displayed when apps access them through the SDK.

"Trusted app" status is enforced through dapp sharing/discovery, and through transparency of requested permissions on installation.

In order for other users to install and use a dapp they need the Application ID generated when it's published. To get that application ID, the dapp developer has to publish it or share it in some way to their users. Then when the users install it, they will see the "permissions" the dapp was published with, which includes the list of external URLs accessed, the type of user data requested, and underlying services utilized. Users have to grant those permissions before anything can be accessed in the sandboxed environment. So by the time the user is using the dapp, they have 1-found the app ID somewhere (presumably if they are willing to install/try it, they already have a degree of "trust" of the developer), 2-seen clearly the external calls and data access requested and granted permission, and 3-know they are running the dapp inside the sandboxed environment so that any external calls or data accessed will be captured before executed and they'll have the chance again to grant permission.

Technically it is possible for someone to create a malicious dapp and put it out there, but people might have a hard time finding it, or if they find it they can consider whether or not they trust the developer and want to grant permissions, and if they find it and install it, they’ll still be alerted when the dapp is trying to access any user data or external http urls.



#### Can existing traditional browser-based dapps be run inside Mainframe OS?
We have gone back and forth on this, but are currently committed to not allowing external dapps (i.e. dapps hosted outside the swarm network/not packaged and deployed from within Mainframe OS) to be installed and run inside Mainframe OS. This does limit the potential reach right now, but as dapps and dapp users are still in their infancy we're making that tradeoff in favor of decentralization, more controlled user experience, and guarantees for end-users around privacy.

#### Will solidity dapps be able to copy&paste over to Mainframe OS?
Existing solidity dapps only need to follow three steps to work in Mainframe OS. 1)Integrate with our wallet, following a similar process to what it was like to integrate with metamask. 2)Make sure their app is structured as required by Mainframe OS (i.e. single-page webapp with index.html file at root level and relative paths to assets). 3)Deploy the front-end webapp to our decentralized storage layer which can easily be done within Mainframe OS. There is no need to redeploy any contracts since the front-end can continue to reference the same instance of contracts on the Ethereum blockchain.

#### How does MFT integrate with Mainframe OS?
MFT tokens are integrated in Mainframe OS to power underlying services. In this initial release, users can stake MFT to send invitations to other users to connect.

Coming soon, developers can stake MFT to submit their dapps to be included in the Mainframe App Store. We are also exploring subscription models for app users and developers, facilitating in-app purchases or upgrades, and tiered/paid dapps, all powered by MFT.

Mainframe is particularly interested in and currently exploring an MFT powered decentralized gas relayer network (see EIP-1077). This dramatically simplifies the user on-boarding experience and opens more clearly defined monetization opportunities for dapp developers. Imagine using a dapp for the first time and not needing to acquire ETH.

As additional underlying services are enhanced to include incentivization functionality, MFT will be integrated more and more to power those services and create a seamless experience for users. Mainframe continues to be dedicated to a frictionless experience for users of our platform.


#### Does Mainframe have it’s own Blockchain?
No. Mainframe Tokens (MFT) are ERC-20 Assets on the Ethereum Blockchain.

#### What blockchains does Mainframe OS support?
Mainframe SDK is currently only integrated with Ethereum. However, the underlying service architecture is designed to be modular and pluggable, able to integrate with any other blockchain. No matter where the industry goes, we’ll support the popular blockchains and programming languages, so builders can use it anywhere.

#### Will Mainframe OS ever integrate with other blockchains?
It is on our roadmap.

#### What will the OS look like once it integrates with other blockchains? Will there be more ‘Identities’ you can choose from, and then choices within apps for payments, etc.?
The idea is to abstract specifics about different blockchains away from the users so it is virtually invisible to them. The chain has implications on identity, wallet, and blockchain transactions, which are all accessed through our SDK functions.

First, Identity: Mainframe Identity is not tied to the Ethereum network, but rather a users' ETH address is stored as a property inside the users Mainframe Identity. So other chains could easily be integrated and those addresses likewise stored as an additional properties on the Mainframe Identity object. The dapps can access the relevant address as needed for their functionality for users and contacts.

Second, Wallet: the Mainframe OS Wallet is a collection of any number of different software or hardware wallet integrations. Currently only Ethereum accounts are supported, but it was designed so other types of wallets could also be integrated eventually. A user selects one of their addresses to be their "default" and when dapps run, it is within that context - which can easily be switched by the user at run-time. So once there are additional chains integrated, there could be multiple defaults (default ETH address, default Tezos address, etc) or whatever makes sense for the different characteristics of those chains. The dapps can then indicate which type of wallet they require and we can ensure the user has that set up before being able to run the dapp.

Third, Blockchain Transactions: Currently the Mainframe SDK wraps several common Ethereum blockchain APIs to simplify integration with that chain. We would extend the SDK for each additional chain supported. We would also support/enable/simplify atomic swaps between chains. That is probably a ways off, but definitely on the roadmap.

Mainframe OS is admittedly pretty Ethereum-centric right now. Seemed a good place to start.   That’s where the developers are, it’s the most decentralized smart contract platform, most battle tested and trusted by users. Other chains like Tron and EOS seem to be attracting game devs but that’s not our focus, we’re currently more interested in supporting developers wanting to build in the defi space. Trust, security and decentralization is a high priority when it comes to these types of apps. That’s not to say we won’t be integrating with other blockchains in the future, our platform is blockchain agnostic and we hope to better enable cross chain interactions between dapps.

#### What is a Mainframe ID? Is it the same as an ETH address?
A Mainframe ID is the 64-hex-digit string that uniquely identifies a Mainframe OS user. It is actually a Swarm hash to the user’s public profile. This ID can be shared with other Mainframe OS users to connect and interact.

A Mainframe user profile includes one or more Ethereum Wallets, including one address designated as their default. This default ETH address is stored as a property in the users public profile and is accessible to their contacts through SDK APIs.

Therefore, no, a Mainframe ID is not the same as an ETH address. But a Mainframe user profile has an ETH address.

Users get to choose whether or not to make their Name and ETH address “discoverable” (public). You can still use Mainframe OS without this.


#### Is Mainframe OS perfect?
This is where we get to give all sorts of disclaimers about how this is very new and young technology and while we know our concepts and designs are solid, Mainframe OS is still very much in an early “alpha” state. Swarm, the underlying storage layer powering much of Mainframe OS, is itself still an alpha project. That means no matter how polished we are on top (which I’m not saying we totally are), there are no guarantees at this stage that things will work smoothly, that things won’t break unexpectedly and without warning, or that versions won’t get released down the road that are not backwards compatible. We of course will try to mitigate that as much as possible. But this is the reality of decentralized development today.

When we started a few years ago, the goal was to build a decentralized, unstoppable, private, secure messaging app. Step by step we went down the stack to realize the plumbing to facilitate all this smoothly simply didn’t exist yet so we got to work helping to build it from the ground up. A lot has gone into Mainframe OS and the way it is designed and built is really very good, if we do say so ourselves. Right now it is early and it’s buggy and incomplete. But with this first user release, we’re now on the path of continual improvements and enhancements so the future is bright.

#### How can I help?
Help us improve Mainframe OS by giving us constructive feedback on our gitter channel
Mainframe OS is an open source project. Jump in and give us a hand!
Try it out. Spread the word. Tell us what you think. Become a part of the Mainframe family.


## Getting even deeper...

#### How do developers publish a dapp in Mainframe OS?
How do users install a dapp in Mainframe OS?
Developers deploy and distribute dapps inside Mainframe OS using the "App Developer Tools". That pushes the files to the Swarm distributed P2P network and outputs an Application ID. End-users have to install the Mainframe OS application and then they can install dapps using that Application ID.

#### How can users find available Mainframe OS dapps?
To improve dapp discovery and easy user experience, we are implementing a system for submitting dapps for a marketplace or "Mainframe Suggested" section. Those dapps will be vetted by us and we'll make them easily available for users to find and install with one click. That would require users "trust" Mainframe to make good suggestions, and yes, does mean Mainframe becomes a centralized arbiter for that curated list. However dapps are still accessible outside of that marketplace so access is not restricted. In the future it will also be possible for other developers to create their own curated dapp marketplaces with easy access to their suggested/vetted dapps.

#### Will the OS ever go mobile?
Yes, Mainframe OS definitely needs to go mobile sooner than later. We are still evaluating tradeoffs of using Swarm/Infura gateways vs local nodes or light nodes or relayers or whatever rapidly changing technologies will next become available. All that has big implications on resources needed to install and run Mainframe OS, and therefore what devices we can reasonably support.

There are additional risks related to living within other platforms (Apple’s app store, etc) especially if Mainframe OS contains a “dapp store” of our own. Mainframe OS can exist and dapps can run without Apple's blessing. So the problem becomes finding/installing Mainframe OS. On desktop there are other options for installing applications besides the app store. On mobile that gets much harder, especially if we try to have a straight dapp store/dapp purchase model. Maybe straightforward in-app purchases are a path. We are trying to be creative.

#### How does the team plan to increase the value of MFT over time?
We have a multi-pronged approach to supporting MFT value that includes:
1-killer dapps to bring users into the Mainframe OS ecosystem. We'll help build or incentivize them initially to showcase capabilities, inspire other devs, and seed the offering. We are prepared to continue being the primary dapp devs, or being heavily involved in this as momentum builds.
2-continual improvements to Mainframe OS to support users and increase capabilities
3-increase integration of MFT in Mainframe OS (see section on token utility below)
4-continued involvement with the decentralized development community, including Ethereum and Swarm and others, to stay aligned in vision, intention, and roadmap.
4-execute on our roadmap as well as possible and as appropriate for the market/resources.

There's no question these are the early days and it's going to take some work to build up to the demand we ultimately expect. We have a long-term view and are invested to see it through.


#### It seems there are still only few devs trying to build dapps on Mainframe. The team is using bounties now, but it doesn’t look like the dev version got a lot of attention yet
We haven’t been pushing too hard but mainly working closely with a select number of devs to keep a tight feedback loop in this early alpha phase.

#### The functionalities seem to be limited initially and although sooo much work was done under the hood to integrate a lot of Web3 technologies, having simple apps (like Noted) ‘decentralized’ does look like making something simple very complicated.
We value decentralization, security and privacy, our feature set might be rather limited right now but we’ve built some solid foundations and feel well positioned to support dapps that align with our values. We’re more than a wallet or browser, we enable developers to host apps on fully decentralised infrastructure and interact over decentralised API’s including comms, payments, social and storage api’s. We’re also aware the ecosystem is young and this space will be evolving rapidly over the next few years, we believe we’ve built a system that’s flexible enough to adapt as new developer and user needs arise.


#### Will Mainframe OS allow atomic swaps?
We do not disallow atomic swaps, so any dapp could be written to support such features. But we do not provide a first class sdk wrapper around any sort of atomic swap functionality.


#### What’s the deal with Swarm? Are IPFS and Swarm trying to accomplish roughly the same thing?
We believe the Swarm vision is a little bit larger, but you can think of them as fairly similar for a storage option. Swarm gets especially interesting when you look at things like their Kademlia neighborhoods/routing system, ACL’s, incentivization,Feeds, PSS (comms), etc.

#### What is the financial incentive for developers to put dapps on the platform? Obviously they wouldn't be able to 'sell' apps to individual users, right?
We have not yet integrated the business models, but are definitely thinking through possibilities for subscriptions, paid apps, in-app purchases, etc that would all make capitalizing on dapps easier for developers. Moreover, we are confident our end-user experience is easier for most users, and that is helpful to dapp developers especially who are developing for less-crypto/dapp-savvy users.


