"use client";

import { useEffect } from "react";

type Props = {
    open: boolean;
    onClose: () => void;
    sizes: number[];
    selectedSize?: number;
    onSelect: (size: number) => void;
    onConfirm: () => void;
    title?: string;
    subtitle?: string;
};

export default function SelectSizeModal({
    open,
    onClose,
    sizes,
    selectedSize,
    onSelect,
    onConfirm,
    title = "Select a size",
    subtitle = "Choose one size to add to cart.",
}: Props) {
    // Close on Escape
    useEffect(() => {
        if (!open) return;

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };

        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [open, onClose]);

    if (!open) return null;

    const stop = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const maxPerRow = 7; // we want all sizes in one row
    const gridCols =
        sizes.length <= maxPerRow ? `grid-cols-${sizes.length}` : "grid-cols-7";

    return (
        <div
            className="fixed inset-0 z-[60]"
            onClick={(e) => {
                stop(e);
                onClose(); // clicking outside closes
            }}
            aria-modal="true"
            role="dialog"
        >
            {/* overlay */}
            <div className="absolute inset-0 bg-black/30" />

            {/* modal */}
            <div
                className="absolute left-1/2 top-1/2 w-[min(96vw,960px)] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-8 shadow-xl"
                onClick={stop}
            >
                {/* header */}
                <div className="flex items-start justify-between gap-6">
                    <div>
                        <h3 className="text-lg font-semibold tracking-tight text-black">
                            {title}
                        </h3>
                        <p className="mt-1 text-sm text-black/60">{subtitle}</p>
                    </div>

                    <button
                        type="button"
                        onClick={(e) => {
                            stop(e);
                            onClose();
                        }}
                        className="rounded-full border border-black/15 bg-white px-4 py-1.5 text-sm text-black transition hover:bg-black/[0.03]"
                    >
                        Close
                    </button>
                </div>

                {/* sizes (single row, no scroll) */}
                <div className="mt-6">
                    <div className={`grid ${gridCols} gap-3`}>
                        {sizes.map((s) => {
                            const active = selectedSize === s;
                            return (
                                <button
                                    key={s}
                                    type="button"
                                    onClick={(e) => {
                                        stop(e);
                                        onSelect(s);
                                    }}
                                    className={[
                                        "h-12 w-full rounded-xl border text-sm font-semibold transition",
                                        active
                                            ? "border-black bg-black text-white"
                                            : "border-black/15 bg-white text-black hover:bg-black/[0.03]",
                                    ].join(" ")}
                                >
                                    {s}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* confirm */}
                <button
                    type="button"
                    onClick={(e) => {
                        stop(e);
                        onConfirm();
                    }}
                    disabled={selectedSize == null}
                    className={[
                        "mt-8 w-full rounded-full px-6 py-4 text-sm font-semibold uppercase tracking-wider transition",
                        selectedSize == null
                            ? "cursor-not-allowed bg-black/20 text-white"
                            : "bg-black text-white hover:bg-black/90",
                    ].join(" ")}
                >
                    Add to cart
                </button>
            </div>
        </div>
    );
}
