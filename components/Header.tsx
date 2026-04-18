import Link from 'next/link';

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-bg-primary/80 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold gradient-text">
          AgntSoul
        </Link>

        <nav className="flex items-center gap-6">
          <Link 
            href="/" 
            className="text-white/60 hover:text-white transition-colors"
          >
            首页
          </Link>
          <Link 
            href="/search" 
            className="text-white/60 hover:text-white transition-colors"
          >
            搜索
          </Link>
          <Link 
            href="/admin" 
            className="text-white/60 hover:text-white transition-colors"
          >
            后台
          </Link>
        </nav>
      </div>
    </header>
  );
}
