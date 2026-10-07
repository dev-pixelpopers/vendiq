
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
        <header data-a="header" className={`invisible absolute left-0 top-0 -translate-y-[137px] z-10 flex w-full items-center px-[134px] py-[40px] justify-between self-start justify-self-center z-10`} >
            <Link href="/" aria-label="VendIQ home" className="max-lg:[--u:calc(100vw/700)]">
                <BrandMark className="fs-50" wordmarkClassName="text-white" />
            </Link>
            <Link
                href={pathname === "/contact" ? "#contact-form" : "/contact"}
                className="flex min-h-[max(36px,calc(56*var(--u)))] items-center gap-[10px] rounded-[6px] border border-[#e6e6e6] bg-white  px-[28px] py-[12px] font-medium text-[#0f0f0f] text-[length:max(12px,calc(20*var(--u)))] tracking-[-0.04em] transition-colors hover:border-brand"
            >
                <Image src={`${A}/logo-mark.png`} alt="" width={40} height={31} className="w-[40px] h-[31px]" />
                Request A Machine
            </Link>
        </header>
    )
}