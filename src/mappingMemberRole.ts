import { PayJoiningFeeCall } from "../generated/templates/MemberRoles/MemberRoles"
import { Member } from "../generated/schema"

export function handlePayJoiningFee(call: PayJoiningFeeCall): void {
  const id = call.inputs._userAddress.toHex();
  let entity = Member.load(id)
  if (entity == null) {
    entity = new Member(id);
    entity.save();
  }
}
