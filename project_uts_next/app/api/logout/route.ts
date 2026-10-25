import {getSession} from "@/backend-scripts/session-handler";
import {redirect} from "next/navigation";

export async function GET(){
    const session = await getSession();
    session.destroy();

    redirect('/login');
}

export async function POST(){
    const session = await getSession();
    session.destroy();

    redirect('/login');
}