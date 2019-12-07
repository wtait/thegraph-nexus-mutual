import { AddStakeCall } from "../generated/TokenFunctionsContract/Contract"
import { Stake } from "../generated/schema"
import { BigInt } from '@graphprotocol/graph-ts'

export function handleAddStake(call: AddStakeCall): void {
    const id = call.transaction.hash.toHex();
    let entity = Stake.load(id)
    if (entity == null) {
        entity = new Stake(id)
        entity.contract = call.inputs._scAddress
        entity.amount = call.inputs._amount
        entity.save();
    }
}