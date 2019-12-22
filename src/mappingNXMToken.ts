import { Address, BigDecimal, Bytes, EthereumEvent } from '@graphprotocol/graph-ts'

import { Transfer } from '../generated/templates/NXMToken/NXMToken'
import { NXMToken } from '../generated/schema'
import { isLatestNexusContract, getInsuredContract, getUser, toTokenDecimals } from "./helpers";

const GENESIS_ADDRESS = '0x0000000000000000000000000000000000000000'

export function handleTransfer(event: Transfer): void {
    if (isLatestNexusContract("nxmToken", event.address)) {    
        let id = event.address.toHex()
        // let contract = eve
        let token = NXMToken.load(id)
        let fromUser = event.params.to
        let toUser = event.params.from
        
        if (token == null) {
            let token = new NXMToken(id)
            // token.initialSupply = 
            token.totalSupply = null
            token.save()
        }

        let amount = toTokenDecimals(event.params.value)
        let isBurn = toUser.toHexString() == GENESIS_ADDRESS
        let isMint = fromUser.toHex() == GENESIS_ADDRESS
        let isTransfer = !isBurn && !isMint

        if(isBurn) {
            // token.totalSupply = token.totalSupply.minus(amount)
            token.save()
        } else if (isMint) {
            // token.totalSupply = token.totalSupply.plus(amount)
            token.save()
        }
    }
}