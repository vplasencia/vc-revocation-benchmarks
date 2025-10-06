import Link from "next/link"

export default function Header() {
  return (
    <header className="flex flex-wrap justify-between p-5 mb-5">
      <Link
        href="/"
        className="text-xl md:mb-auto mb-5 font-bold text-blue-500"
      >
        Revocation Benchmarks
      </Link>
      <Link
        href="/bench"
        className="font-semibold text-blue-600 hover:text-blue-700"
      >
        Run Benchmarks
      </Link>
    </header>
  )
}
