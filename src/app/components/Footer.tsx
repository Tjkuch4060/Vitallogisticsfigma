import React from 'react';
import { Leaf } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-white border-t border-slate-100 pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-emerald-900 rounded-lg flex items-center justify-center text-white">
                 <Leaf className="w-4 h-4" />
              </div>
              <span className="font-bold text-xl text-emerald-950">VitalLogistics</span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed">
              Minnesota's premier B2B hemp wholesale platform for licensed retailers.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-6">Quick Links</h4>
            <ul className="space-y-4 text-sm text-slate-500">
              <li><a href="#" className="hover:text-emerald-700 transition-colors">Products</a></li>
              <li><a href="#" className="hover:text-emerald-700KP transition-colors">Apply for Access</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-6">Support</h4>
            <ul className="space-y-4 text-sm text-slate-500">
              <li><a href="#" className="hover:text-emerald-700 transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-emerald-700 transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-6">Legal</h4>
            <ul className="space-y-4 text-sm text-slate-500">
              <li><a href="#" className="hover:text-emerald-700 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-emerald-700 transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-8 text-center">
            <p className="text-slate-400 text-sm mb-2">© 2026 VitalLogistics. All rights reserved.</p>
            <p className="text-slate-400 text-xs">Licensed LPHE-R wholesale platform</p>
        </div>
      </div>
    </footer>
  );
}
