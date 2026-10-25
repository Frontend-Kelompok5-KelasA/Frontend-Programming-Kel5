import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

const sessionOptions = {
    password: "njnjadhu32ui4rt29uwd9asoksjia9sdisajddddddd9i9a9diad93u94r9ad",
    cookieName: "user_session"
};

interface SessionData {
    userData?: {user_id: string, email: string, username: string, role: string}
}

export async function getSession(){
    return await getIronSession<SessionData>(await cookies(), sessionOptions);
}