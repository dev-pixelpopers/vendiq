import Image from "next/image";

type BrandMarkProps = {
  /** Sets the logo height via font-size (e.g. `fs-50`, `text-5xl`). */
  className?: string;
  /** Wordmark colour: `text-*` class applied to the masked wordmark. */
  wordmarkClassName?: string;
};

/**
 * VendIQ logo: raster mark + wordmark rendered as a solid fill through the
 * Figma alpha mask, so it can take any colour.
 */
export default function BrandMark({
  className = "fs-50",
  wordmarkClassName = "text-[#101010]",
}: BrandMarkProps) {
  return (
    <span className={`inline-flex items-center gap-[0.07em] leading-none ${className}`}>
      <Image
        src="/images/vendiq/logo-mark.png"
        alt=""
        width={112}
        height={85}
        className="h-[1em] w-auto"
      />
      <span
        aria-hidden
        className={`block aspect-[3.386] h-[1em] bg-current [mask-image:url(/images/vendiq/logo-wordmark-mask.png)] [mask-position:right_center] [mask-repeat:no-repeat] [mask-size:auto_100%] ${wordmarkClassName}`}
      />
    </span>
  );
}
