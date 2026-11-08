"use client";

import {useEffect} from "react";

export default function Logout() {
    useEffect(() => {
        const load = async() => {
            await fetch('/api/logout');

            setTimeout(() => {
                window.location.href = '/login'
            }, 1000);
        };

        load();
    }, []);

    return (<main />);
}