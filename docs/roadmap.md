---
id: roadmap
title: Mainframe OS Development Roadmap
sidebar_label: roadmap
---

updated June 2019

## Background
Mainframe OS has been developed over the past year with the unwavering core values of **Privacy and Decentralization**.
The goal is to provide easy access to developing, discovering, and using **Unstoppable Dapps** that likewise reinforce common values,
and to power the platform with **MFT**. This in turn will lead to greater **Freedom, Independence, and Empowerment** for all users.

In pursuit of these goals, we have designed a rich and full-featured user experience,
integrated with various Web3 infrastructure and services, developed and standardized low-level protocols,
collaborated with the broader Web3 community, and at every layer carefully considered any tradeoffs and
compromises necessary to balance user experience, available technology, and adherence to guiding values.
We continue to research and discuss at length how to leverage Blockchain technology to _power the platform with MFT_,
with the first contracts already implemented and more already in development.
We are proud of the first form released to developers at the end of 2018, the rough alpha version released to users
in early 2019, and are currently heads down working hard towards future milestones as outlined below.

Mainframe OS is a new way to experience the potential of decentralization.
We are excited about all we've accomplished so far,
driven by the possibilities of the future,
sobered by the scope of work required to get us there,
and sustained by the community's continued support and enthusiasm for the project.

For more information and answers to common questions about Mainfrmae OS, see the [FAQs](https://docs.mainframeos.com/docs/faq).


## Research projects

### Blockchain-based subscriptions
Investigating best way to implement subscriptions on the blockchain.
This would lay the groundwork to have Mainframe OS users subscribe (using MFT)
to a plan that includes premium features of the platform as well as potentially
abstracting Ethereum gas and Swarm storage fees.

### Community-moderated apps marketplace
Mainframe OS is a platform for building and using decentralized applications. So far there
is very basic discovery (suggested apps list) to help users find and install new apps.
This will be expanded in Alpha 4 and Beat 1 (see below) but will still be fairly limited in scope.
Ultimately the intent is to create a robust community-driven marketplace to reinforce our
core value of decentralization. Needs to include rankings, incentivization, promotion, accountability,
and rich filtering tools.

### App developer business models
In line with the research on subscriptions and marketplace listed above, we are exploring
possibilities for app developers to include subscriptions in their apps through the Mainframe SDK.
We are also exploring ways to support paid apps and in-app purchases through the Mainframe SDK.

### Future-proof data structure for Mainframe protocols
This is very important as Mainframe OS moves out of the Alpha phase to into a Beta state.
We'll need to support compatibility for the various protocols (contacts, identity, communications,
storage, payments, etc) between versions, as well as backwards and forward compatibility
with the data vault.

## Q3 Milestone: Alpha 4

### Architecture Update
Improvements to Mainframe OS to simplify the underlying architecture and make it more robust and reliable.
Vault structure, and wallets, apps, and contact protocols all updated. This is a huge and important effort,
but will have little immediate external impact. But these changes will lay the groundwork for an
improved installation experience, enable more rapid development of platform functionality,
and facilitate data migrations necessary for future-proofing.

### Mainframe OS User Features

- **Mainframe OS updates:** Notifications for available update and option for auto-installing updates.
- **`mainframeOS://` protocol:** Ability to create links to auto-install/open
Mainframe OS apps, or search for Mainframe OS users. Facilitates out-of-band sharing of apps and contacts which
in turn helps expand access and awareness.
- **Apps management:** Ability to delete apps, recall permissions, and view app and developer details.
- **Apps Marketplace:** List of "Verified" Apps, as submitted by developers via smart contract. Basic verification of
developer and source code by Mainframe. (See future goals for decentralized marketplace above.)
- **Wallets management:** Support for adding and removing wallet addresses, revealing local HD wallet seeds,
and support for new Ledger wallet derivation path

### Mainframe OS Development Tools

- **App submission to marketplace (with MFT payment):** App developers can submit information and pay fee (using MFT)
to have their app considered for inclusion in the list of Verified apps in the Apps Marketplace.
- **App managmeent:** Support for additional app metadata (description, website, etc). Ability to
view and edit app details and permissions.
- **Developer profile:** Enhanced developer identity linked to published apps including description, links to website or github,
and list of other publsihed apps.

### Mainframe apps

- **Lendo:** New social lending platform to facilitate blockchain-based loans to Mainframe OS contacts.
- **Compounded and CDP Pro:** UX updates
- **Noted and Payment:** bugfixes and basic improvements


## Q4 Milestone: Beta 1

### Mainframe OS protocols & SDK APIs

- **Communications:** Ability to send and receive private, asynchronous messages between Mainframe OS contacts
- **Files:** Ability to upload, access, and manage encrypted files to the decentralized Swarm storage layer,
including sharing with Mainframe OS contacts.

### Mainframe OS User Features

- **Vault management:** Ability to backup user data to a specified location and restore from
that file on a fresh installation or new device. Additional option to wipe data and start from fresh vault.
- **Multiple user accounts:** Ability to create multiple Mainframe OS identities, including
separate profile, wallets, contacts, applications, and user data.
- **Apps discovery:** Ability to share apps with contacts - e.g. explicitly share single app
with single contact or option to share list of all installed apps with all contacts.
- **Notifications:** prompts for various information and activities including contact requests, payments,
available Mainframe OS or app updates, or app-driven messages.
- **Additional Tokens:** Support for DAI, and ability to include other tokens dynamically in system wallet.
- **Transfer funds using Wyre or Coinbase:** Users can use a credit card to purchase ETH with the integrated Wyre Service;
or authorize Mainframe OS to transfer funds from a Coinbase wallet.
- **Integrated ETH <> MFT exchange:** Built-in access to Uniswap contracts and community-funded liquidity pool for easy ETH<>MFT exchanges.
- **Decentralized file management:** Visual file explorer for storing, accessing, and managing files in the decentralized storage layer.
- **File sharing:** Ability to share encrypted files with contacts

### Mainframe apps

- **Messenger:** Reference app to showcase new communications protocol and SDK APIs.
- **File sharing:** Refernce app to showcase new user storage and file sharing capabilitiies.
