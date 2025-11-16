export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-200 py-6 mt-12 transition-colors dark:bg-gray-800">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center px-4">
        
        <div className="flex gap-4 mt-2 md:mt-0">
          <a
            href="https://twitter.com/"
            target="_blank"
            className="hover:text-white transition"
          >
            Twitter
          </a>
          <a
            href="https://facebook.com/"
            target="_blank"
            className="hover:text-white transition"
          >
            Facebook
          </a>
          <a
            href="https://instagram.com/"
            target="_blank"
            className="hover:text-white transition"
          >
            Instagram
          </a>
        </div>
        <p>© 2025 GROUP1. All rights reserved.</p>
      </div>
    </footer>
  );
}
