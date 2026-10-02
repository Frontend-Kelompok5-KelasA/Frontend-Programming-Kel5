fetch('api/session').then(async res => {
    const session = await res.json();
    if(!session)window.location.href = '/login';

    document.getElementById('profile-name').textContent = session.username;
});