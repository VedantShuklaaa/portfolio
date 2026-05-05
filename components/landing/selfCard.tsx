"use client";
import { useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord, faGithub, faLinkedinIn, faTwitter } from "@fortawesome/free-brands-svg-icons";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import Link from "next/link";
import { gsap } from "gsap";

interface SocialLink {
  icon: IconDefinition;
  href: string;
}

const socialLinks: SocialLink[] = [
  { icon: faTwitter, href: "https://x.com/SegFault_Dev" },
  { icon: faDiscord, href: "https://discord.com/users/852863471422537759" },
  { icon: faLinkedinIn, href: "https://www.linkedin.com/in/vedant-shukla-17a953239/" },
  { icon: faGithub, href: "https://github.com/VedantShuklaaa" },
];

export default function DetailsCard() {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;   
    const y = (e.clientY - rect.top) / rect.height - 0.5;  

    const MAX_TILT = 14; 

    gsap.to(card, {
      rotateX: -y * MAX_TILT,   
      rotateY:  x * MAX_TILT,   
      transformPerspective: 800,
      duration: 0.35,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = () => {
    gsap.to(cardRef.current, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.55,
      ease: "elastic.out(1, 0.6)",
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ willChange: "transform" }}
      className="h-[50vh] w-[17vw] border rounded-xl bg-card-foreground p-4 gap-2 text-secondary flex flex-col items-center font-mono cursor-default"
    >
      <div className="h-[60%] w-full border rounded-xl bg-card relative overflow-hidden" />

      <div className="h-[40%] p-1 flex flex-col items-center justify-between">
        <h1 className="text-4xl font-bold text-center flex">VEDANT SHUKLA</h1>
        <span className="flex text-center text-zinc-400 dark:text-zinc-600">
          A Rust developer turning complex problems into clean infrastructure.
        </span>

        <div className="flex items-center justify-center gap-2">
          {socialLinks.map(({ icon, href }, idx) => (
            <Link
              key={idx}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="h-10 w-10 rounded-full bg-card flex items-center justify-center text-foreground hover:opacity-80 transition-opacity"
            >
              <FontAwesomeIcon icon={icon} className="h-5 w-5" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}