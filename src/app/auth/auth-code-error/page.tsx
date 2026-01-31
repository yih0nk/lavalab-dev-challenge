import Link from "next/link";

export default function AuthCodeErrorPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="text-3xl font-semibold text-[#181818] mb-4">
          Authentication Error
        </h1>
        <p className="text-neutral-500 mb-6">
          There was a problem verifying your authentication. The link may have
          expired or already been used.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-[#181818] text-white font-medium rounded-md hover:bg-[#2D2D2D] transition-colors"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
