import { Address, BigDecimal, Bytes, EthereumEvent } from '@graphprotocol/graph-ts'

import { Transfer } from '../generated/templates/NXMToken/NXMToken'
import { NXMToken } from '../generated/schema'
import { isLatestNexusContract, getInsuredContract, getUser, toTokenDecimals } from "./helpers";

const GENESIS_ADDRESS = '0x0000000000000000000000000000000000000000'

export function handleTransfer(event: Transfer): void {
    if (isLatestNexusContract("nxmToken", event.address)) {    
    let id = event.address.toHex()
    let token = NXMToken.load(id)
    let fromUser = event.params.to
    let toUser = event.params.from
    if (token == null) {
        let token = new NXMToken(id)
        token.save()
    }

    let isBurn = toUser.toHexString() == GENESIS_ADDRESS
    let isMint = fromUser.toHex() == GENESIS_ADDRESS
    let isTransfer = !isBurn && !isMint
}