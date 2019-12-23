import { Address, BigDecimal, Bytes, EthereumEvent, BigInt, JSONValue, Value, log, ipfs } from '@graphprotocol/graph-ts'
import { Unknown } from '../generated/TokenRegistry/TokenRegistry'
import { ERC20 } from '../generated/TokenRegistry/ERC20'
import { Transfer } from '../generated/templates/NXMToken/NXMToken'
import {NXMToken as NXMContract} from '../generated/templates/NXMToken/NXMToken'
import { NXMToken } from '../generated/schema'
import { isLatestNexusContract, getInsuredContract, getUser, toTokenDecimals, ZERO, decodeFlags, hasBurnEvent, hasMintEvent, toDecimal } from "./helpers";

const REGISTRY_HASH = 'QmS91QaQozMhQzT68yRxXz7SL2a3snixX9WXiyVNPaVDt8'
const GENESIS_ADDRESS = '0x0000000000000000000000000000000000000000'
const DEFAULT_DECIMALS = 18


//["0xd7c49cee7e9188cca6ad8ff264c1da2e69d4cf3b","Nexus Mutual","NXM",18,null,"https://raw.githubusercontent.com/somish/NexusMutual-Website/blob/master/assets/img/nxm-favicon-152x152.png",0]
//["0xd7c49cee7e9188cca6ad8ff264c1da2e69d4cf3b","Nexus Mutual","NXM",8,null,null,7] --tokens-finance


export function initRegistry(event: Unknown): void {
    log.debug('Initializing token registry, block={}', [event.block.number.toString()])
  
    ipfs.mapJSON(REGISTRY_HASH, 'createToken', Value.fromString(''))
  }
  
  export function createToken(value: JSONValue, userData: Value): void {
    let rawData = value.toArray()
  
    let address: string | null = rawData[0].isNull() ? null : rawData[0].toString()
    let name: string | null = rawData[1].isNull() ? null : rawData[1].toString()
    let symbol: string | null = rawData[2].isNull() ? null : rawData[2].toString()
    let decimals: u32 = rawData[3].isNull() ? DEFAULT_DECIMALS : rawData[3].toBigInt().toI32()
    let description: string | null = rawData[4].isNull() ? null : rawData[4].toString()
    let imageUrl: string | null = rawData[5].isNull() ? null : rawData[5].toString()
    let flags: u16 = rawData[6].isNull() ? 0 : (rawData[6].toU64() as u16)
  
    if (address != null) {
      let contractAddress = Address.fromString(address)
  
      // Persist token data if it doesn't already exist
      let token = NXMToken.load(contractAddress.toHex())
  
      if (token == null) {
        let initialSupply = ERC20.bind(contractAddress).try_totalSupply()
  
        token = new NXMToken(contractAddress.toHex())
        token.address = contractAddress
        token.name = name
        token.symbol = symbol
        token.decimals = decimals
        token.description = description
        token.imageUrl = imageUrl
        token.flags = decodeFlags(flags)
  
        token.eventCount = ZERO
        token.burnEventCount = ZERO
        token.mintEventCount = ZERO
        token.transferEventCount = ZERO
  
        token.totalSupply = initialSupply.reverted ? ZERO.toBigDecimal() : toDecimal(initialSupply.value, token.decimals)
        token.totalBurned = ZERO.toBigDecimal()
        token.totalMinted = ZERO.toBigDecimal()
        token.totalTransferred = ZERO.toBigDecimal()
  
        log.debug('Adding token to registry, name: {}, symbol: {}, address: {}, decimals: {}, flags: {}', [
          token.name,
          token.symbol,
          token.id,
          decimals.toString(), // TODO: use token.decimals.toString() when type 'i32' implements toString()
          token.flags.length ? token.flags.join('|') : 'none',
        ])
  
        token.save()
  
        // Start indexing token events
        StandardToken.create(contractAddress)
  
        if (hasBurnEvent(flags)) {
          BurnableToken.create(contractAddress)
        }
  
        if (hasMintEvent(flags)) {
          MintableToken.create(contractAddress)
        }
      } else {
        log.warning('Token {} already in registry', [contractAddress.toHex()])
      }
    }
  }






export function handleTransfer(event: Transfer): void {
    if (isLatestNexusContract("nxmToken", event.address)) {    
        let id = event.address.toHex()
        let nxmcontract = NXMContract.bind(event.address)
        let tokenEntity = NXMToken.load(id)
        let fromUser = event.params.to
        let toUser = event.params.from
        
        //token.totalSupply = nxmcontract.try_totalSupply()

        // if (token == null) {
        //     let token = new NXMToken(id)
        //     // token.initialSupply = nxmcontract.
        //     token.totalSupply = nxmcontract.
        //     token.save()
        // }

        // tokenEntity.totalSupply = nxmcontract.totalSupply()
        // tokenEntity.initialSupply = nxmcontract.call.arguments[1]
        // if(totalSupply !== null) {
        //     token.totalSupply = totalSupply
        // }

        // let amount = toTokenDecimals(event.params.value)
        // let isBurn = toUser.toHexString() == GENESIS_ADDRESS
        // let isMint = fromUser.toHex() == GENESIS_ADDRESS
        // let isTransfer = !isBurn && !isMint

        // if(isBurn) {
        //     // token.totalSupply = token.totalSupply.minus(amount)
        //     tokenEntity.save()
        // } else if (isMint) {
        //     // token.totalSupply = token.totalSupply.plus(amount)
        //     tokenEntity.save()
        // }
        // tokenEntity.save()
    }
}