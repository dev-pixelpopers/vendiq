
"use client";
import BrandMark from "@/components/brand/BrandMark";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { whenIntroDone } from "@/components/intro/intro";

const A = "/images/vendiq";

export default function Header() {
    const pathname = usePathname();
    useGSAP((_, contextSafe) => {
        // After the preloader hands over (homepage), or on its own timing elsewhere.
        const reveal = contextSafe!((waited: boolean) => {
            gsap.to(
                "[data-a='header']",
                { autoAlpha: 1, y: 0, duration: 1, ease: "power2.out", delay: waited ? 0.1 : 1.2 },
            )
        })
        return whenIntroDone(reveal)
    }, [])
    return (
        <header data-a="header" className="invisible absolute left-0 top-0 z-10 flex w-full -translate-y-[137px] items-center justify-between gap-4 self-start justify-self-center px-[clamp(20px,7vw,134px)] py-[clamp(18px,2.1vw,40px)]">
            <Link href="/" aria-label="VendIQ home" className="shrink-0 [--u:clamp(0.5px,calc(100vw/1920),1.4px)] max-lg:[--u:clamp(0.5px,calc(100vw/700),0.9px)]">
                <BrandMark className="fs-50" wordmarkClassName="text-white" />
            </Link>
            <Link
                href={pathname === "/contact" ? "#contact-form" : "/contact"}
                className="flex min-h-[clamp(38px,2.9vw,56px)] shrink-0 items-center gap-[clamp(6px,0.6vw,10px)] whitespace-nowrap rounded-[6px] border border-[#e6e6e6] bg-white px-[clamp(12px,1.5vw,28px)] py-[clamp(6px,0.6vw,12px)] font-medium text-[#0f0f0f] text-[length:clamp(12px,1.05vw,20px)] tracking-[-0.04em] transition-colors hover:border-brand hover:bg-sun"
            >
                <Image src={`${A}/logo-mark.png`} alt="" width={40} height={31} className="h-[clamp(18px,1.6vw,31px)] w-auto" />
                Request A Machine
            </Link>
        </header>
    )
}
