fetch("api/session").then(async (res) => {
    const session = await res.json();
    if(session){
        window.location.href = "/index";
    }
});