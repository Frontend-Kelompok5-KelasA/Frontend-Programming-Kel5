"use client";

import { useState } from "react";
// import biar kalau user = guest, diarahin login
import { useAuthPrompt } from "./AuthPromptProvider";

interface FavoriteButtonProps {
    restaurantKey: string;
    initialFavorite: boolean;
    isLoggedIn: boolean;
    onFavoriteChange: (key: string, isFavorite: boolean) => void;
}

export default function FavoriteButton({
    restaurantKey,
    initialFavorite,
    isLoggedIn,
    onFavoriteChange
}: FavoriteButtonProps) {
    const [isFavorite, setIsFavorite] = useState(initialFavorite);
    const [loading, setLoading] = useState(false);

    const handleFavorite = async () => {
        // Jika guest, tampilkan modal login
        if (!isLoggedIn) {
            window.dispatchEvent(new Event("require-login"));
            return;
        }

        if (loading) return;

        setLoading(true);

        try {
            const response = await fetch("/api/favorites", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    restaurantKey,
                    action: isFavorite ? "remove" : "add"
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Gagal mengubah Favorite.");
            }

            setIsFavorite(data.isFavorite);

            onFavoriteChange(restaurantKey, data.isFavorite);

        } catch (err) {
            console.error("Favorite error:", err);
        } finally {
            setLoading(false);
        }
    };


    return(
        <button
            onClick={handleFavorite}
            className={`favorite-btn ${isFavorite ? "active" : ""}`}
        >
            <svg
                width="30"
                height="32"
                viewBox="0 0 100 120"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M15 5 H85 V115 L50 87 L15 115 Z"
                    fill={isFavorite ? "#ff9b19" : "none"}
                    stroke="#ff9b19"
                    strokeWidth="5"
                    strokeLinejoin="round"
                />
            </svg>

            {isFavorite && (
                <span className="particles">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                </span>
            )}
        </button>
    )
}