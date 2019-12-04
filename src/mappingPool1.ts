import { MakeCoverBeginCall } from "../generated/templates/Pool1/Pool1"
import { Cover, MasterContract } from "../generated/schema"
import { log } from "@graphprotocol/graph-ts";

export function handleNewCover(call: MakeCoverBeginCall): void {
  let mc = MasterContract.load("1");
  if (mc.pool1 != call.to) {
    log.info("Ignoring outdated pool1 contract: {}", [call.to.toHexString()]);
    return;
  }
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
