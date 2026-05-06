/**
 * Footer Component
 * Site footer with links and info
 */

'use client';

import Link from 'next/link';
import {
  Github,
  Twitter,
  Facebook,
  Instagram,
  Mail,
  Phone,
  MapPin,
} from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 gradient-btn rounded-lg flex items-center justify-center font-bold text-xl">
              Z
            </div>
            <span className="font-bold text-lg">Z Book</span>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed">
            Modern bookstore for Gen Z readers. Discover trending, new, and popular
            books from around the world.
          </p>
          {/* Social Links */}
          <div className="flex gap-4">
            <Link href="https://twitter.com" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white smooth-transition" aria-label="Twitter">
              <Twitter className="w-5 h-5" />
            </Link>
            <Link href="https://facebook.com" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white smooth-transition" aria-label="Facebook">
              <Facebook className="w-5 h-5" />
            </Link>
            <Link href="https://instagram.com" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white smooth-transition" aria-label="Instagram">
              <Instagram className="w-5 h-5" />
            </Link>
            <Link href="https://github.com" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white smooth-transition" aria-label="GitHub">
              <Github className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-4">
          <h3 className="font-bold text-lg">Quick Links</h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li>
              <Link href="/" className="hover:text-white smooth-transition">
                Home
              </Link>
            </li>
            <li>
              <Link href="/books" className="hover:text-white smooth-transition">
                Browse Books
              </Link>
            </li>
            <li>
              <Link href="/trending" className="hover:text-white smooth-transition">
                Trending
              </Link>
            </li>
            <li>
              <Link href="/new" className="hover:text-white smooth-transition">
                New Releases
              </Link>
            </li>
          </ul>
        </div>

        {/* Categories */}
        <div className="space-y-4">
          <h3 className="font-bold text-lg">Categories</h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li>
              <Link
                href="/books?category=fiction"
                className="hover:text-white smooth-transition"
              >
                Fiction
              </Link>
            </li>
            <li>
              <Link
                href="/books?category=self-help"
                className="hover:text-white smooth-transition"
              >
                Self-Help
              </Link>
            </li>
            <li>
              <Link
                href="/books?category=technology"
                className="hover:text-white smooth-transition"
              >
                Technology
              </Link>
            </li>
            <li>
              <Link
                href="/books?category=cambodian"
                className="hover:text-white smooth-transition"
              >
                Cambodian
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div className="space-y-4">
          <h3 className="font-bold text-lg">Contact</h3>
          <div className="space-y-3 text-gray-400 text-sm">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <span>Phnom Penh, Cambodia</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 flex-shrink-0" />
              <a href="tel:+855123456789" className="hover:text-white smooth-transition">
                +855 (0) 123 456 789
              </a>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 flex-shrink-0" />
              <a href="mailto:info@zbook.com" className="hover:text-white smooth-transition">
                info@zbook.com
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm gap-4">
          <p>&copy; {currentYear} Z Book. Z BOOK WEB make by Sokhavy Thoeun.</p>
          <div className="flex gap-6">
            <Link href="mailto:info@zbook.com?subject=Privacy%20Policy" className="hover:text-white smooth-transition">
              Privacy Policy
            </Link>
            <Link href="mailto:info@zbook.com?subject=Terms%20of%20Service" className="hover:text-white smooth-transition">
              Terms of Service
            </Link>
            <Link href="mailto:info@zbook.com?subject=Cookie%20Policy" className="hover:text-white smooth-transition">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
