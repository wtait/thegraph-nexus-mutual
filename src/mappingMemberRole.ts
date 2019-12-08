import { PayJoiningFeeCall } from "../generated/templates/MemberRoles/MemberRoles"
import { Member } from "../generated/schema"
import { isLatestNexusContract } from "./helpers";

export function handlePayJoiningFee(call: PayJoiningFeeCall): void {
  if (isLatestNexusContract("memberRoles", call.to)) {
    let id = call.inputs._userAddress.toHex();
    let entity = Member.load(id)
    if (entity == null) {
      entity = new Member(id);
      entity.save();
    }
  }
}
