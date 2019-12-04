import { Bytes, log } from "@graphprotocol/graph-ts"
import { MasterContract as MC, AddNewVersionCall } from "../generated/MasterContract/MasterContract";
import { MemberRoles, Pool1 } from "../generated/templates";
import { MasterContract } from  "../generated/schema";

export function updateContracts(call: AddNewVersionCall): void {
    log.info("Updating contracts", []);
    const mc = MC.bind(call.to);
    let pool1 = mc.getLatestAddress(Bytes.fromHexString("5031") as Bytes); // P1
    let memberRoles = mc.getLatestAddress(Bytes.fromHexString("4d52") as Bytes); // MR
    
    let entity = MasterContract.load("1");
    if (entity == null) {
        entity = new MasterContract("1");
        entity.pool1 = new Bytes(0);
        entity.memberRoles = new Bytes(0);
    }
    if (entity.pool1 != pool1) {
        log.info("Found new pool1 contract: {}", [pool1.toHexString()]);
        entity.pool1 = pool1;
        Pool1.create(pool1);
    }
    if (entity.memberRoles != memberRoles) {
        log.info("Found new memberRoles contract: {}", [memberRoles.toHexString()]);
        entity.memberRoles = memberRoles;
        MemberRoles.create(memberRoles);
    }
    entity.save();
}