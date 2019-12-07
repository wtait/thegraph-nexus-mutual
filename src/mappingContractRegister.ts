import { Bytes, log, Address, Value } from "@graphprotocol/graph-ts"
import { ContractRegister, AddNewVersionCall } from "../generated/ContractRegister/ContractRegister";
import { MemberRoles, Pool1, TokenFunctions } from "../generated/templates";
import { LatestContracts } from  "../generated/schema";

function getLatestAddress(register: ContractRegister, hexString: string): Address {
  return register.getLatestAddress(Bytes.fromHexString(hexString) as Bytes);
}

export function updateContracts(call: AddNewVersionCall): void {
  log.info("Updating contracts", []);
  let register = ContractRegister.bind(call.to);

  // got bytes using https://onlineutf8tools.com/convert-utf8-to-bytes
  let pool1 = getLatestAddress(register, "5031"); // P1
  let memberRoles =  getLatestAddress(register, "4d52"); // MR
  let tokenFunctions =  getLatestAddress(register, "5446"); // TF
  
  let entity = LatestContracts.load("1");
  if (entity == null) {
    entity = new LatestContracts("1");
    entity.pool1 = new Bytes(0);
    entity.memberRoles = new Bytes(0);
    entity.tokenFunctions = new Bytes(0);
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
  if (entity.tokenFunctions != tokenFunctions) {
    log.info("Found new tokenFunctions contract: {}", [tokenFunctions.toHexString()]);
    entity.tokenFunctions = tokenFunctions;
    TokenFunctions.create(tokenFunctions);
  }
  entity.save();
}