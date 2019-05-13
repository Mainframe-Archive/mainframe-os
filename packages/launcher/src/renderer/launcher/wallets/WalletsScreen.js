// @flow

import { Text, Button, TextField } from '@morpheus-ui/core'
import { Form, type FormSubmitPayload } from '@morpheus-ui/forms'
import LedgerIcon from '@morpheus-ui/icons/Ledger'
import PlusSymbolMdIcon from '@morpheus-ui/icons/PlusSymbolMd'
import PlusSymbolSmIcon from '@morpheus-ui/icons/PlusSymbolSm'
import DownloadMdIcon from '@morpheus-ui/icons/DownloadMd'
import EthCircledIcon from '@morpheus-ui/icons/EthCircled'
import MftCircledIcon from '@morpheus-ui/icons/MftCircled'
import { sortBy } from 'lodash'
import React, { Component } from 'react'
import {
  commitMutation,
  createFragmentContainer,
  graphql,
  type Environment,
} from 'react-relay'
import styled from 'styled-components/native'

import RelayRenderer from '../RelayRenderer'

import WalletImportView from './WalletImportView'
import WalletCreateModal from './WalletCreateModal'
import WalletAddLedgerModal from './WalletAddLedgerModal'
import WallePreviewModal from './WalletPreviewModal'
import WalletIcon from './WalletIcon'
import type { WalletsScreen_user as User } from './__generated__/WalletsScreen_user.graphql'

type Props = {
  relay: {
    environment: Environment,
  },
  user: User,
}

type State = {
  showModal?: ?string,
  errorMsg?: ?string,
  hoverAddress?: ?string,
  hoverName?: ?string,
  editName?: ?string,
  selectedAddress?: ?string,
}

type Wallet = {|
  +name: ?string,
  +localID: string,
  +accounts: $ReadOnlyArray<{|
    +address: string,
    +balances: {|
      +eth: string,
      +mft: string,
    |},
  |}>,
|}

const Container = styled.View`
  flex: 1;
  padding: 54px 54px 40px 54px;
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
  max-width: 200px;
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
  align-items: center;
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
  flex-direction: row;
  align-items: center;
`

const Ballance = styled.View`
  margin-left: 40px;
  flex-direction: row;
  align-items: center;
`

const addWalletMutation = graphql`
  mutation WalletsScreenAddHDWalletAccountMutation(
    $input: AddHDWalletAccountInput!
  ) {
    addHDWalletAccount(input: $input) {
      address
      viewer {
        ...WalletsScreen_user
      }
    }
  }
`

const setProfileWalletMutation = graphql`
  mutation WalletsScreenSetProfileWalletMutation(
    $input: SetProfileWalletInput!
  ) {
    setProfileWallet(input: $input) {
      viewer {
        ...WalletsScreen_user
      }
    }
  }
`

const roundNum = (number, precision) => {
  precision = Math.pow(10, precision)
  return Math.ceil(Number(number) * precision) / precision
}

class WalletsView extends Component<Props, State> {
  state = {}

  onPressAddAddress = (wallet: Wallet) => {
    commitMutation(this.props.relay.environment, {
      mutation: addWalletMutation,
      variables: {
        input: {
          walletID: wallet.localID,
          index: wallet.accounts.length,
        },
      },
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
    commitMutation(this.props.relay.environment, {
      mutation: setProfileWalletMutation,
      variables: {
        input: {
          address: this.state.selectedAddress,
        },
      },
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

  onPressCreate = () => {
    this.setState({
      showModal: 'create_wallet',
    })
  }

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
    return this.state.showModal === 'import_wallet' ? (
      <WalletImportView onClose={this.onCloseModal} />
    ) : null
  }

  renderConnectLedgerView() {
    return this.state.showModal === 'connect_ledger' ? (
      <WalletAddLedgerModal
        wallets={this.props.user.ethWallets.ledger}
        onClose={this.onCloseModal}
      />
    ) : null
  }

  renderWalletAccounts(wallet: Wallet) {
    const accounts = wallet.accounts.map((a, index) => {
      const setHover = () => this.setState({ hoverAddress: a.address })
      const selectAddress = () => this.setState({ selectedAddress: a.address })

      const hover = this.state.hoverAddress === a.address
      const isDefault = a.address === this.props.user.profile.ethAddress
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
            <WalletIcon address={a.address} />
            <Text
              variant={[
                'mono',
                'marginLeft15',
                'ellipsis',
                hover ? 'red' : 'greyMed',
              ]}
              size={12}>
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
              }}
              color="#232323">
              {roundNum(a.balances.eth, 5)} ETH
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
              }}
              color="#232323">
              {roundNum(a.balances.mft, 5)} MFT
            </Text>
          </Ballance>
        </AccountView>
      )
    })

    return <>{accounts}</>
  }

  renderWallets() {
    const { ethWallets } = this.props.user
    const wallets = sortBy(
      [
        ...ethWallets.hd.map(w => ({ ...w, type: 'hd' })),
        ...ethWallets.ledger.map(w => ({ ...w, type: 'ledger' })),
      ],
      'name',
    ).map(w => {
      const editing = this.state.editName === w.name
      // const setEditWallet = () => this.setState({ editName: w.name })
      // const setHover = () => this.setState({ hoverName: w.name })

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
              // onFocus={setHover}
              // onMouseOver={setHover}
              // onMouseOut={this.dismissNameHover}
              // onBlur={this.dismissNameHover}
              // onPress={setEditWallet}
              hover={hover}>
              {w.type === 'ledger' && (
                <IconWrapper>
                  <LedgerIcon width={13} height={13} />
                </IconWrapper>
              )}
              <Text variant={['greyDark23', 'ellipsis']} bold size={14}>
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
          {this.renderWalletAccounts(w)}
          {w.type === 'hd' && (
            <AddWrapper>
              <Button
                variant={['xSmall', 'marginVertical10']}
                Icon={PlusSymbolSmIcon}
                onPress={() => this.onPressAddAddress(w)}
                title="ADD"
              />
            </AddWrapper>
          )}
        </WalletView>
      )
    })
    return <>{wallets}</>
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
          this.state.selectedAddress === this.props.user.profile.ethAddress
        }
      />
    )
  }

  renderCreateModal() {
    return this.state.showModal === 'create_wallet' ? (
      <WalletCreateModal
        onClose={this.onCloseModal}
        onSetupWallet={this.onCloseModal}
      />
    ) : null
  }

  render() {
    return (
      <Container>
        <WalletsContainer>
          <ScrollView>
            {this.renderWallets()}
            {this.renderPreviewModal()}
            {this.renderCreateModal()}
            {this.renderImportView()}
            {this.renderConnectLedgerView()}
          </ScrollView>
        </WalletsContainer>
        <Buttons className="white-shadow">
          <Button
            variant={['completeOnboarding', 'walletOnboarding', 'marginLeft20']}
            title="Create"
            onPress={this.onPressCreate}
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
      </Container>
    )
  }
}

const RelayContainer = createFragmentContainer(WalletsView, {
  user: graphql`
    fragment WalletsScreen_user on User {
      profile {
        ethAddress
      }
      ethWallets {
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

export default function WalletsScreen() {
  return (
    <RelayRenderer
      render={({ props }) => (props ? <RelayContainer {...props} /> : null)}
      query={graphql`
        query WalletsScreenQuery {
          user: viewer {
            ...WalletsScreen_user
          }
        }
      `}
    />
  )
}
