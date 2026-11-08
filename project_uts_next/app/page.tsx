"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { loadSession } from "@/script/utils";
import { onLoad } from "@/script/home";
import parse, { domToReact } from "html-react-parser";

export default function Home() {
    const [loading, setLoading] = useState(true);

    const refs = useRef<any>({
        hero: {
            title: null,
            subtitle: null
        },
        facts: {
            title: null,
            subtitle: null
        },
        special: {
            title: null,
            subtitle: null
        },
        popular: {
            title: null,
            subtitle: null
        },
        explore: {
            title: null,
            subtitle: null,
            button: null
        }
    });

    const [factContent, setFactContent] = useState("");
    const [specialContent, setSpecialContent] = useState("")

    const load = async() => {
        await loadSession();
        await onLoad(refs.current, {factContent: setFactContent, specialContent: setSpecialContent});

        setTimeout(() => setLoading(false), 1000);
    };

    useEffect(() => {
        load();
    }, []);

    const options = {
        replace: (node: any) => {
            if(node.name === "img"){
                const { src, alt, width, height } = node.attribs;
                return (
                    <Image src={src} alt={alt} width={500} height={500} />
                );
            }
        }
    }

  return (
    <main className={loading ? "d-none" : ""}>
        {/* content */}
        <div className="main-container">
            {/* hero */}
            <div className="hero">
                <Image className="gambar-logo" src="/images/websiteEssentials/logo.png" alt="gambar logo" width={500} height={500} />

                <div className="hero-text">
                    <h1 ref={(e) => {
                        refs.current.hero.title = e;
                    }} />
                    <p ref={(e) => {
                        refs.current.hero.subtitle = e;
                    }} />
                </div>
            </div>

            {/* facts */}
            <div className="facts">
                <div className="facts-title">
                    <h2 ref={(e) => {
                        refs.current.facts.title = e;
                    }} />
                    <p ref={(e) => {
                        refs.current.facts.subtitle = e;
                    }} />
                </div>
                <div className="container-fluid facts-fill">
                    <div className="row gy-4">
                        { parse(factContent, options) }
                    </div>
                </div>
            </div>

            {/* special */}
            <div className="special">
                <div className="special-title">
                    <h1 ref={(e) => {
                        refs.current.special.title = e;
                    }} />
                    <p ref={(e) => {
                        refs.current.special.subtitle = e;
                    }} />
                </div>
                <div id="special-carousel" className="carousel slide" data-bs-ride="carousel" data-bs-interval="7500" data-bs-pause="false">
                    <div className="carousel-inner">
                        { parse(specialContent, options) }
                    </div>
                    <a className="carousel-control-prev" type="button" data-bs-target="#special-carousel" data-bs-slide="prev">
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="sr-only"></span>
                    </a>
                    <a className="carousel-control-next" type="button" data-bs-target="#special-carousel" data-bs-slide="next">
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="sr-only"></span>
                    </a>
                </div>
            </div>

            {/* popular foods */}
            <div className="popular-food">
                <h2 ref={(e) => {
                    refs.current.popular.title = e;
                }} />
                <p ref={(e) => {
                    refs.current.popular.subtitle = e;
                }} />

                <div className="popular-wrapper">
                    <div id="popular-carousel" className="carousel slide" data-bs-ride="false" data-bs-interval="false">
                        <div className="carousel-inner" id="popular-list">
                            {/* Slide & card di-generate dari /api/resto lewat script.js */}
                        </div>
                    </div>

                    <button id="popular-prev" className="popular-btn popular-btn-prev d-none"
                            type="button" data-bs-target="#popular-carousel" data-bs-slide="prev" aria-label="Sebelumnya">
                        <i className="bi bi-chevron-left"></i>
                    </button>
                    <button id="popular-next" className="popular-btn popular-btn-next d-none"
                            type="button" data-bs-target="#popular-carousel" data-bs-slide="next" aria-label="Berikutnya">
                        <i className="bi bi-chevron-right"></i>
                    </button>
                </div>
            </div>

            {/* start explore */}
            <div className="start-explore">
                <div className="container-fluid exploring p-0">
                    <div className="row g-0">
                        <div className="col-12 col-lg-6 explore-images">
                            <div id="explore-carousel" className="carousel slide" data-bs-ride="carousel" data-bs-interval="3000" data-bs-pause="false">
                                <div className="carousel-inner">
                                    {/* Slide gambar di-generate dari /api/resto lewat script.js */}
                                </div>
                            </div>
                        </div>

                        <div className="col-12 col-lg-6 explore-text">
                            <h1 ref={(e) => {
                                refs.current.explore.title = e;
                            }} />
                            <p ref={(e) => {
                                refs.current.explore.subtitle = e;
                            }} />
                            <Link href="/explore">
                                <button id="explore-food-button" ref={(e) => {
                                    refs.current.explore.button = e;
                                }} />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
  );
}
