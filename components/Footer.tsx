export default function Footer() {
  return (
    <footer className="w-full py-6 px-4 border-t border-white/10 bg-black text-center mt-auto mb-16">
      <p className="text-sm text-gray-500">
        © {new Date().getFullYear()} Nitvibes dev by Konnektwer. All rights reserved.
      </p>
    </footer>
  );
}