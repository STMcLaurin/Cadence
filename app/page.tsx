import { requireChatGPTUser } from "./chatgpt-auth";
import CadenceApp from "./cadence-app";
export const dynamic = "force-dynamic";
export default async function Home() { const user = await requireChatGPTUser("/"); return <CadenceApp initialName={user.fullName?.split(" ")[0] || user.displayName.split("@")[0]} />; }
