import "server-only";
import fs from "node:fs";
import path from "node:path";
export type HeaderContact = {phone:string;email:string;address:string;locationLabel:string};
export function getHeaderContact(): HeaderContact {
 const file=path.join(process.cwd(),"content","header.json");
 const data=JSON.parse(fs.readFileSync(file,"utf8"));
 return {phone:String(data.phone??""),email:String(data.email??""),address:String(data.address??""),locationLabel:String(data.locationLabel??"Адрес")};
}
