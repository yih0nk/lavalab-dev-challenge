import Link from "next/link";
import Image from "next/image";

type Props = {
    title?: string;
    subtitle?: string;
    showHomeButton?: boolean;
};

export default function NewPage({
    title = "Coming Soon",
    subtitle = "We’re still building this page. Check back soon.",
    showHomeButton = true,
}: Props) {
    return (
        <main className="min-h-dvh w-full">
            <div className="relative min-h-dvh w-full overflow-hidden">
                {/* Background */}
                <div className="absolute inset-0 bg-white" />
                <div className="absolute -top-24 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-black/[0.04] blur-3xl" />
                <div className="absolute -bottom-24 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-black/[0.05] blur-3xl" />

                {/* Content */}
                <div className="relative mx-auto flex min-h-dvh w-full max-w-[1200px] flex-col items-center justify-center px-6 py-10 text-center">
                    {/* Logo */}
                    <div className="mb-8 flex items-center justify-center">
                        <Image
                            src="/images/icons/100.svg"
                            alt="Logo"
                            width={150}
                            height={40}
                            className="h-auto w-[clamp(120px,12vw,160px)]"
                            priority
                        />
                    </div>

                    <h1 className="text-[clamp(32px,4vw,56px)] font-semibold tracking-tight text-black">
                        {title}
                    </h1>

                    <p className="mt-3 max-w-[52ch] text-[clamp(14px,1.4vw,18px)] leading-relaxed text-black/70">
                        {subtitle}
                    </p>

                    <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
                        {showHomeButton && (
                            <Link
                                href="/"
                                className="inline-flex items-center justify-center rounded-full border border-black/15 bg-black px-6 py-3 text-sm font-medium text-white transition hover:bg-black/90"
                            >
                                Back to Home
                            </Link>
                        )}
                    </div>

                    <div className="mt-10 text-xs text-black/40">
                        © {new Date().getFullYear()} ShopAll
                    </div>
                </div>
            </div>
        </main>
    );
}