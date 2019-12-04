import { MakeCoverBeginCall } from "../generated/templates/Pool1/Pool1"
import { Cover } from "../generated/schema"

export function handleNewCover(call: MakeCoverBeginCall): void {
  const id = call.transaction.hash.toHex();
  let entity = Cover.load(id)
  if (entity == null) {
    entity = new Cover(id);
    entity.coverPeriod = call.inputs.coverPeriod;
    entity.contract = call.inputs.smartCAdd;
    entity.member = call.from.toHex();
    entity.createdOn =  call.block.timestamp;
    entity.save();
  }
}
