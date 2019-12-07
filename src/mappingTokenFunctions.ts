import { AddStakeCall } from "../generated/templates/TokenFunctions/TokenFunctions"
import { Stake, LatestContracts } from "../generated/schema"
import { log } from '@graphprotocol/graph-ts'

export function handleAddStake(call: AddStakeCall): void {
  if (LatestContracts.load("1").tokenFunctions != call.to) {
    log.info("Ignoring outdated tokenFunctions contract: {}", [call.to.toHexString()]);
    return;
  }
  let id = call.transaction.hash.toHex();
  let entity = Stake.load(id)
  if (entity == null) {
    entity = new Stake(id)
    entity.contract = call.inputs._scAddress
    entity.amount = call.inputs._amount
    entity.save();
  }
}