import { AddStakeCall } from "../generated/TokenFunctionsContract/Contract"
import { Stake } from "../generated/schema"

export function handleAddStake(call: AddStakeCall): void {
    const id = call.transaction.hash.toHex();
    let entity = Stake.load(id)
    if (entity == null) {
        entity.save();
    }
}