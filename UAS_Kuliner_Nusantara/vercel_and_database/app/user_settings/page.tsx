"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { loadSession } from "@/script/utils";
import { onLoad } from "@/script/home";

export default function UserSettings() {
  return (
    <main>
      <div className="main-container">
        {/* <!-- bagian biodata --> */}
        <Image
          className="gambar-logo"
          src="/images/websiteEssentials/profile.png"
          alt="logo"
          width={360}
          height={360}
        />

        <div className="biodata">
          <h3 id="profile-name">User&apos;s Name</h3>
          <p id="profile-fav">User&apos;s Settings</p>
        </div>

        <div className="settings"></div>
      </div>
    </main>
  );
}
