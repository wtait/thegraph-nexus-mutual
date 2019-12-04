import { PayJoiningFeeCall } from "../generated/templates/MemberRoles/MemberRoles"
import { Member, MasterContract } from "../generated/schema"
import { log } from "@graphprotocol/graph-ts";

export function handlePayJoiningFee(call: PayJoiningFeeCall): void {
  let mc = MasterContract.load("1");
  if (mc.memberRoles != call.to) {
    log.info("Ignoring outdated memberRole contract: {}", [call.to.toHexString()]);
    return;
  }
  const id = call.inputs._userAddress.toHex();
  let entity = Member.load(id)
  if (entity == null) {
    entity = new Member(id);
    entity.save();
  }
}
