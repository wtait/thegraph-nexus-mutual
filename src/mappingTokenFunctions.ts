import { AddStakeCall } from "../generated/templates/TokenFunctions/TokenFunctions"
import { Stake } from "../generated/schema"
import { isLatestNexusContract, getInsuredContract } from "./helpers";
import { BigInt } from "@graphprotocol/graph-ts";

export function handleAddStake(call: AddStakeCall): void {
  if (isLatestNexusContract("tokenFunctions", call.to)) {
    let id = call.transaction.hash.toHex();
    let entity = Stake.load(id);
    if (entity == null) {
      entity = new Stake(id);
      entity.contract = getInsuredContract(call.inputs._scAddress).id;
      entity.amount = call.inputs._amount;
      entity.daysToStake = 250;
      entity.created =  call.block.timestamp;
      entity.expires = call.block.timestamp.plus(BigInt.fromI32(entity.daysToStake * 24 * 60 * 60));
      entity.save();
    }
  }
}
