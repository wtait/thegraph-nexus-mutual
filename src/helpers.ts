import { NexusContractList, InsuredContract, User } from "../generated/schema";
import { log, Address, Bytes, BigInt, BigDecimal } from "@graphprotocol/graph-ts";
import { ContractRegister } from "../generated/ContractRegister/ContractRegister";


// Flags
const DETAILED_TOKEN = 1 << 0
const BURN_EVENT = 1 << 1
const MINT_EVENT = 1 << 2
const BURN_TRANSFER = 1 << 3
const MINT_TRANSFER = 1 << 4



export let ZERO = BigInt.fromI32(0)

export function toDecimal(value: BigInt, decimals: u32): BigDecimal {
  let precision = BigInt.fromI32(10)
    .pow(<u8>decimals)
    .toBigDecimal()

  return value.divDecimal(precision)
}

export function decodeFlags(value: u64): string[] {
  let flags: string[] = []

  if (isDetailed(value)) {
    flags.push('detailed')
  }

  if (isBurnable(value)) {
    flags.push('burnable')

    if (hasBurnEvent(value)) {
      flags.push('burnable-event')
    }

    if (hasBurnTransfer(value)) {
      flags.push('burnable-transfer')
    }
  }

  if (isMintable(value)) {
    flags.push('mintable')

    if (hasMintEvent(value)) {
      flags.push('mintable-event')
    }

    if (hasMintTransfer(value)) {
      flags.push('mintable-transfer')
    }
  }

  return flags
}

// If token contract implements optional ERC20 fields
export function isDetailed(flags: u64): boolean {
  return (flags & DETAILED_TOKEN) != 0
}

// If tokens can be irreversibly destroyed
export function isBurnable(flags: u64): boolean {
  return hasBurnEvent(flags) || hasBurnTransfer(flags)
}

// If token contract emits Burn event when destroy/burn tokens
export function hasBurnEvent(flags: u64): boolean {
  return (flags & BURN_EVENT) != 0
}

// If token contract emits Transfer event to genesis address when destroy/burn tokens
export function hasBurnTransfer(flags: u64): boolean {
  return (flags & BURN_TRANSFER) != 0
}

// If tokens can be created or minted
export function isMintable(flags: u64): boolean {
  return hasMintEvent(flags) || hasMintTransfer(flags)
}

// If token contract emits Mint event when create/mint tokens
export function hasMintEvent(flags: u64): boolean {
  return (flags & MINT_EVENT) != 0
}

// If token contract emits Transfer event from genesis address when create/mint tokens
export function hasMintTransfer(flags: u64): boolean {
  return (flags & MINT_TRANSFER) != 0
}

export function isLatestNexusContract(contractName: string, address: Address): boolean {
  if (NexusContractList.load("1").get(contractName).toBytes() != address) {
    log.info("Ignoring outdated {} contract: {}", [contractName, address.toHexString()]);
    return false;
  }
  return true;
}

export function getInsuredContract(address: Address): InsuredContract {
  let id = address.toHexString();
  let entity = InsuredContract.load(id)
  if (entity == null) {
    entity = new InsuredContract(id);
    entity.save();
  }
  return entity as InsuredContract;
}

export function getUser(address: Address): User {
  let id = address.toHexString();
  let entity = User.load(id);
  if (entity == null) {
    entity = new User(id);
    entity.isMember = false;
    entity.coverCount = 0;
    entity.stakeCount = 0;
    // entity.balance = 0;
    entity.save();
  }
  return entity as User;
}

export function getLatestAddress(register: ContractRegister, hexString: string): Address {
  return register.getLatestAddress(Bytes.fromHexString(hexString) as Bytes);
}

export function toTokenDecimals(num: BigInt): BigDecimal {
  let decimalMultiplier = BigInt.fromI32(10).pow(18).toBigDecimal();
  return num.divDecimal(decimalMultiplier);
}