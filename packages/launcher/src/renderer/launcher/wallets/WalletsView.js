// @flow

import React, { Component, type ElementRef } from 'react'
import { createFragmentContainer, graphql, commitMutation } from 'react-relay'
import styled from 'styled-components/native'
import { Text, Button, TextField } from '@morpheus-ui/core'
import { Form, type FormSubmitPayload } from '@morpheus-ui/forms'

import LedgerIcon from '@morpheus-ui/icons/Ledger'
import PlusSymbolMdIcon from '@morpheus-ui/icons/PlusSymbolMd'
import PlusSymbolSmIcon from '@morpheus-ui/icons/PlusSymbolSm'

import DownloadMdIcon from '@morpheus-ui/icons/DownloadMd'
import EthCircledIcon from '@morpheus-ui/icons/EthCircled'
import MftCircledIcon from '@morpheus-ui/icons/MftCircled'

import { sortBy } from 'lodash'

import { EnvironmentContext } from '../RelayEnvironment'
import type { CurrentUser } from '../LauncherContext'
import WalletImportView from './WalletImportView'
import WalletAddLedgerModal from './WalletAddLedgerModal'
import WallePreviewModal from './WalletPreviewModal'

export type WalletAccounts = Array<{
  address: string,
  balances: { mft: string, eth: string },
}>

export type Wallet = {
  localID: string,
  name: ?string,
  accounts: WalletAccounts,
  type?: 'hd' | 'ledger',
}

export type Wallets = {
  ethWallets: {
    hd: Array<Wallet>,
    ledger: Array<Wallet>,
  },
}

type Props = {
  wallets: Wallets,
  user: CurrentUser,
}

type State = {
  showModal?: ?string,
  errorMsg?: ?string,
  hoverAddress?: ?string,
  hoverName?: ?string,
  editName?: ?string,
  selectedAddress?: ?string,
  wallets: Array<Wallet>,
}

const Container = styled.View`
  flex: 1;
`

const Title = styled.View`
  margin-bottom: 10px;
`

const Buttons = styled.View`
  padding-top: 20px;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
`

const WalletsContainer = styled.View`
  flex: 1;
`

const ScrollView = styled.ScrollView`
  padding-bottom: 100px;
`

const WalletView = styled.View`
  margin: 10px 0;
  padding: 10px 10px;
  background-color: ${props => props.theme.colors.LIGHT_GREY_F9};
  border-left-width: 5px;
  border-left-style: solid;
  border-left-color: ${props => props.theme.colors.PRIMARY_BLUE};
  border-radius: 3px;
`

const EditContainer = styled.View`
  flex-direction: row;
  align-items: center;
  max-width: 300px;
`

const WalletTitle = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding: 10px;
  ${props => props.hover && `background-color: #EFEFEF;`}
`

const IconWrapper = styled.Text`
  margin-right: 10px;
  color: #232323;
`
const AddWrapper = styled.View`
  align-items: flex-end;
`

const AccountView = styled.TouchableOpacity`
  padding: 10px;
  flex-direction: row;
  border-top-width: 1px;
  border-top-color: #efefef;
  ${props => props.first && `border-top-width: 0;`}
  ${props =>
    props.hover &&
    `background-color: #FFF;
     shadow-color: #000;
     shadow-offset: {width: 0, height: 0};
     shadow-opacity: 0.1;
     shadow-radius: 8;
  `}
`

const Address = styled.View`
  flex: 1;
  overflow: hidden;
  flex-wrap: wrap;
`

const Ballance = styled.View`
  margin-left: 40px;
  flex-direction: row;
  align-items: center;
`

const createWalletMutation = graphql`
  mutation WalletsViewCreateHDWalletMutation(
    $input: CreateHDWalletInput!
    $userID: String!
  ) {
    createHDWallet(input: $input) {
      hdWallet {
        accounts {
          address
        }
        localID
      }
      viewer {
        identities {
          ...Launcher_identities
        }
        wallets {
          ...WalletsView_wallets @arguments(userID: $userID)
        }
      }
    }
  }
`

const addWalletMutation = graphql`
  mutation WalletsViewAddHDWalletAccountMutation(
    $input: AddHDWalletAccountInput!
    $userID: String!
  ) {
    addHDWalletAccount(input: $input) {
      address
      viewer {
        identities {
          ...Launcher_identities
        }
        wallets {
          ...WalletsView_wallets @arguments(userID: $userID)
        }
      }
    }
  }
`

const setDefaultWalletMutation = graphql`
  mutation WalletsViewSetDefaultWalletMutation(
    $input: SetDefaultWalletInput!
    $userID: String!
  ) {
    setDefaultWallet(input: $input) {
      viewer {
        identities {
          ...Launcher_identities
        }
        wallets {
          ...WalletsView_wallets @arguments(userID: $userID)
        }
      }
    }
  }
`

const getWalletsArray = (props: Props): Array<Wallet> => {
  const { ethWallets } = props.wallets
  const wallets: Array<Wallet> = sortBy(
    [
      ...ethWallets.hd.map(w => ({ ...w, type: 'hd' })),
      ...ethWallets.ledger.map(w => ({ ...w, type: 'ledger' })),
    ],
    'name',
  )
  return wallets
}

class WalletsView extends Component<Props, State> {
  static contextType = EnvironmentContext

  constructor(props: Props) {
    super(props)
    this.state = { wallets: getWalletsArray(props) }
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.wallets !== prevProps.wallets) {
      this.setState({ wallets: getWalletsArray(this.props) })
    }
  }

  onPressCreateHDWallet = () => {
    const { ethWallets } = this.props.wallets
    let input, walletMutation
    if (ethWallets.hd.length) {
      const newIndex = ethWallets.hd[0].accounts.length
      walletMutation = addWalletMutation
      input = {
        walletID: ethWallets.hd[0].localID,
        userID: this.props.user.localID,
        index: newIndex,
      }
    } else {
      walletMutation = createWalletMutation
      input = {
        blockchain: 'ETHEREUM',
        name: 'Account 1',
        userID: this.props.user.localID,
      }
    }

    commitMutation(this.context, {
      mutation: walletMutation,
      // $FlowFixMe: Relay type
      variables: { input, userID: this.props.user.localID },
      onError: err => {
        const msg =
          err.message || 'Sorry, there was a problem creating the wallet.'
        this.setState({
          errorMsg: msg,
        })
      },
    })
  }

  onPressSetDefault = () => {
    const { user } = this.props
    const input = {
      address: this.state.selectedAddress,
      userID: user.localID,
    }

    commitMutation(this.context, {
      mutation: setDefaultWalletMutation,
      variables: { input, userID: user.localID },
      onError: err => {
        const msg =
          err.message ||
          'Sorry, there was a problem setting your default wallet.'
        this.setState({
          errorMsg: msg,
        })
      },
    })
  }

  changeWalletName = (payload: FormSubmitPayload) => {
    // TO BE IMPLEMENTED
    if (payload.valid) {
      this.dismissEdit()
    }
  }

  dismissEdit = () => this.setState({ editName: '' })

  dismissAddressHover = () => this.setState({ hoverAddress: '' })

  dismissNameHover = () => this.setState({ hoverName: '' })

  closeAddressModal = () => this.setState({ selectedAddress: '' })

  onPressImport = () => {
    this.setState({
      showModal: 'import_wallet',
    })
  }

  onPressConnectLedger = () => {
    this.setState({
      showModal: 'connect_ledger',
    })
  }

  onCloseModal = () => {
    this.setState({
      showModal: undefined,
    })
  }

  // RENDER

  renderImportView() {
    const { ethWallets } = this.props.wallets
    const currentWallet = ethWallets.hd.length ? ethWallets.hd[0].localID : null
    return this.state.showModal === 'import_wallet' ? (
      <WalletImportView
        onClose={this.onCloseModal}
        currentWalletID={currentWallet}
        userID={this.props.user.localID}
      />
    ) : null
  }

  renderConnectLedgerView() {
    return this.state.showModal === 'connect_ledger' ? (
      <WalletAddLedgerModal
        userID={this.props.user.localID}
        onClose={this.onCloseModal}
      />
    ) : null
  }

  renderWalletAccounts(accounts: WalletAccounts): Array<ElementRef<any>> {
    return accounts.map((a, index) => {
      const setHover = () => this.setState({ hoverAddress: a.address })
      const selectAddress = () => this.setState({ selectedAddress: a.address })

      const hover = this.state.hoverAddress === a.address
      const isDefault = a.address === this.props.user.defaultEthAddress
      const defaultFlag = isDefault ? (
        <Text
          variant={hover ? 'red' : 'greyMed'}
          size={11}
          theme={{
            marginLeft: 40,
          }}>
          [default]
        </Text>
      ) : null

      return (
        <AccountView
          onPress={selectAddress}
          onFocus={setHover}
          onMouseOver={setHover}
          onMouseOut={this.dismissAddressHover}
          key={a.address}
          hover={hover}
          first={index === 0}
          className="transition">
          <Address>
            <Text
              variant={['mono', 'ellipsis', hover ? 'red' : 'greyMed']}
              size={11}>
              {a.address}
            </Text>
          </Address>
          {defaultFlag}
          <Ballance>
            <EthCircledIcon width={14} height={14} color="#C0C0C0" />
            <Text
              variant={['ellipsis', hover ? 'red' : 'greyMed']}
              size={11}
              theme={{
                marginLeft: 10,
                minWidth: 80,
              }}>
              {a.balances.eth} ETH
            </Text>
          </Ballance>
          <Ballance>
            <MftCircledIcon width={14} height={14} color="#C0C0C0" />
            <Text
              variant={['ellipsis', hover ? 'red' : 'greyMed']}
              size={11}
              theme={{
                marginLeft: 10,
                minWidth: 80,
              }}>
              {a.balances.mft} MFT
            </Text>
          </Ballance>
        </AccountView>
      )
    })
  }

  renderWallets() {
    return (
      <>
        {this.state.wallets.map(w => {
          const setEditWallet = () => this.setState({ editName: w.name })
          const editing = this.state.editName === w.name

          const setHover = () => this.setState({ hoverName: w.name })

          const hover = this.state.hoverName === w.name

          return (
            <WalletView key={w.name}>
              {editing ? (
                <EditContainer>
                  <Form onSubmit={this.changeWalletName}>
                    <TextField
                      autoFocus
                      submitOnPressIcon
                      required
                      name="name"
                      defaultValue={w.name}
                      label="Wallet name"
                      IconRight={() => (
                        <Text size={10} color="white" variant="redButton">
                          OK
                        </Text>
                      )}
                    />
                  </Form>
                </EditContainer>
              ) : (
                <WalletTitle
                  className="transition"
                  onFocus={setHover}
                  onMouseOver={setHover}
                  onMouseOut={this.dismissNameHover}
                  onBlur={this.dismissNameHover}
                  onPress={setEditWallet}
                  hover={hover}>
                  {w.type === 'ledger' && (
                    <IconWrapper>
                      <LedgerIcon width={13} height={13} />
                    </IconWrapper>
                  )}
                  <Text variant={['greyDark23']} bold size={14}>
                    {w.name}
                  </Text>
                  <Text
                    color={hover ? '#808080' : 'transparent'}
                    variant={['greyDark23']}
                    theme={{ marginLeft: 10 }}
                    bold
                    size={10}>
                    EDIT
                  </Text>
                </WalletTitle>
              )}
              {this.renderWalletAccounts(w.accounts)}
              {w.type === 'hd' && (
                <AddWrapper>
                  <Button
                    variant={['xSmall', 'marginVertical10']}
                    Icon={PlusSymbolSmIcon}
                    onPress={this.onPressCreateHDWallet}
                    title="ADD"
                  />
                </AddWrapper>
              )}
            </WalletView>
          )
        })}
      </>
    )
  }

  renderPreviewModal() {
    if (!this.state.selectedAddress) return null

    return (
      <WallePreviewModal
        onClose={this.closeAddressModal}
        onDeleteWallet={this.closeAddressModal}
        onCheckDefault={this.onPressSetDefault}
        address={this.state.selectedAddress}
        default={
          this.state.selectedAddress === this.props.user.defaultEthAddress
        }
      />
    )
  }

  render() {
    return (
      <Container>
        <Title>
          <Text variant={['smallTitle', 'blue', 'noPadding', 'bold']}>
            Wallets
          </Text>
        </Title>
        <WalletsContainer>
          <ScrollView>
            {this.renderWallets()}
            {this.renderImportView()}
            {this.renderConnectLedgerView()}
          </ScrollView>
        </WalletsContainer>
        <Buttons className="white-shadow">
          <Button
            variant={['completeOnboarding', 'walletOnboarding', 'marginLeft20']}
            title="Create"
            onPress={this.onPressCreateHDWallet}
            testID="onboard-create-wallet-button"
            Icon={PlusSymbolMdIcon}
          />

          <Button
            onPress={this.onPressImport}
            variant={['completeOnboarding', 'walletOnboarding', 'marginLeft20']}
            title="Import"
            Icon={DownloadMdIcon}
          />

          <Button
            onPress={this.onPressConnectLedger}
            variant={['completeOnboarding', 'walletOnboarding', 'marginLeft20']}
            title="Ledger"
            Icon={LedgerIcon}
          />
        </Buttons>
        {this.renderPreviewModal()}
      </Container>
    )
  }
}

export default createFragmentContainer(WalletsView, {
  wallets: graphql`
    fragment WalletsView_wallets on Wallets
      @argumentDefinitions(userID: { type: "String!" }) {
      ethWallets(userID: $userID) {
        hd {
          name
          localID
          accounts {
            address
            balances {
              eth
              mft
            }
          }
        }
        ledger {
          name
          localID
          accounts {
            address
            balances {
              eth
              mft
            }
          }
        }
      }
    }
  `,
})
