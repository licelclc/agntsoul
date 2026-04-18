import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-white/10 py-8 mt-20">
      <div className="max-w-7xl mx-auto px-6 text-center text-white/40 text-sm">
        <p>© 2026 AgntSoul. AI 人格市场</p>
        <p className="mt-2">
          <Link href="/" className="hover:text-white transition-colors">首页</Link>
          <span className="mx-2">·</span>
          <Link href="/admin" className="hover:text-white transition-colors">后台</Link>
        </p>
      </div>
    </footer>
  );
}
