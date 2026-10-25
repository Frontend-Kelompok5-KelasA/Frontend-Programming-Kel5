export function esc(s: string) {
    const toReplace: Record<string, string> = {
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    };

    return s.replace(/[&<>"']/g, (c) => toReplace[c] || s);
}

let currentUser;

export function loadSession(){
    fetch('/api/session').then(async res => {
        const session = await res.json();
        currentUser = session;
        if(session){
            document.getElementById('profile-logged')?.classList.remove('d-none');
            return;
        }

        document.getElementById('profile-out')?.classList.remove('d-none');
    });
}