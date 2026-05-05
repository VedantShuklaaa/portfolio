"use client";
import { useState, useEffect, useRef } from "react";
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import GridBackgroundDemo from "@/components/grid-background-demo";
import { faRust } from "@fortawesome/free-brands-svg-icons";
import { faGear } from '@fortawesome/free-solid-svg-icons'
import '@fortawesome/fontawesome-svg-core/styles.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";



export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const section1 = useRef<HTMLDivElement>(null);
  const section2 = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (!containerRef.current || !section1.current || !section2.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=70%",
        scrub: 1,
      }
    });

    tl.to(section1.current, {
      yPercent: -30,
      ease: "none",
    }, 0);

    tl.fromTo(section2.current,
      { scale: 0.6, transformOrigin: "center center" },
      { scale: 1, ease: "none", },
      0
    );

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <div className="w-full flex flex-col items-end" ref={containerRef}>
      <GridBackgroundDemo />


      <div className="w-[60vw] h-screen flex flex-col items-start justify-center gap-25 z-100" ref={section1}>
        <div className="flex flex-col gap-5">
          <h1 className="text-9xl font-bold">BACKEND <br /> <span className="text-transparent bg-clip-text bg-gradient-to-br from-cyan-300 via-blue-400 to-indigo-400 dark:from-cyan-600 dark:via-blue-700 dark:to-indigo-800">ENGINEER</span></h1>
          <span>
            <p className="text-xl font-mono">
              Passionate about crafting fast, reliable backends.<br /> Specialize in building scalable products <br />with Rust and Node.js.
            </p>
          </span>
        </div>

        <div className="flex gap-4 font-mono">
          <div className="relative h-[25vh] w-[18vw] border rounded-xl bg-card flex flex-col gap-3 items-start justify-center p-4 ">
            <FontAwesomeIcon icon={faRust} size="3x" className="absolute right-2 bottom-4 animate-pulse" />
            <h1 className="font-bold text-3xl text-start">Rust Backend <br /> Engineer</h1>
            <p className="text-sm">Building fast, reliable, <br /> and scalable APIs and <br /> systems with Rust.</p>
          </div>
          <div className="relative h-[25vh] w-[30vw] border rounded-xl bg-card flex flex-col gap-3 items-start justify-center p-4 ">
            <FontAwesomeIcon icon={faGear} size="3x" className="absolute right-2 bottom-4 animate-pulse" />
            <h1 className="font-bold text-3xl text-start">System Architecture</h1>
            <p className="text-sm">Architecting robust, high-performance backends <br /> using clean design patterns and efficient, <br /> scalable APIs to ensure seamless operation, <br /> high availability, and optimal performance in <br /> complex, production-grade environments.</p>
          </div>
        </div>
      </div>


      <div className="h-screen w-full z-100 flex flex-col items-center justify-center gap-2 font-mono rounded-xl" ref={section2}>
        <span className="w-full flex px-25">
          <h1 className="text-9xl font-bold">
            PROJECTS
          </h1>
        </span>
        <div className="h-[60vh] w-[90vw] border bg-card rounded-xl p-4 grid grid-cols-4 gap-2">
          <div className="h-full w-full p-2 border flex items-end bg-card-foreground rounded-md hover:scale-102 transition-scale duration-300 cursor-pointer">
            <div className="h-[40%] w-full bg-card hover:bg-transparent transition-color duration-300 rounded-md">

            </div>
          </div>
          <div className="h-full w-full p-2 border flex items-end bg-card-foreground rounded-md hover:scale-102 transition-scale duration-300 cursor-pointer">
            <div className="h-[40%] w-full bg-card hover:bg-transparent transition-color duration-300 rounded-md">

            </div>
          </div>
          <div className="h-full w-full p-2 border flex items-end bg-card-foreground rounded-md hover:scale-102 transition-scale duration-300 cursor-pointer">
            <div className="h-[40%] w-full bg-card hover:bg-transparent transition-color duration-300 rounded-md">

            </div>
          </div>
          <div className="h-full w-full p-2 border flex items-end bg-card-foreground rounded-md hover:scale-102 transition-scale duration-300 cursor-pointer">
            <div className="h-[40%] w-full bg-card hover:bg-transparent transition-color duration-300 rounded-md">

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}