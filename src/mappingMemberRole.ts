import { PayJoiningFeeCall } from "../generated/templates/MemberRoles/MemberRoles"
import { Member, LatestContracts } from "../generated/schema"
import { log } from "@graphprotocol/graph-ts";

export function handlePayJoiningFee(call: PayJoiningFeeCall): void {
  if (LatestContracts.load("1").memberRoles != call.to) {
    log.info("Ignoring outdated memberRole contract: {}", [call.to.toHexString()]);
    return;
  }
  let id = call.inputs._userAddress.toHex();
  let entity = Member.load(id)
  if (entity == null) {
    entity = new Member(id);
    entity.save();
  }
}
