import { BigDecimal, Bytes, EthereumEvent } from '@graphprotocol/graph-ts'

import { Transfer } from '../generated/templates/NXMToken/NXMToken'
import { NXMToken } from '../generated/schema'


export function handleTransfer(event: Transfer): void {
    let token = NXMToken.load(event.address.toHex())
}