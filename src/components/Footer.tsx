import { Link } from "react-router-dom";
import { Github, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <a href="/">
                {/* Logo
             <div className="h-10 w-10 min-w-[40px] rounded-xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white font-bold text-xl shadow-lg">A</div> */}
                <img
                  src="/logo.png"
                  alt="Aanya AI"
                  className="h-10 w-10 min-w-[40px] rounded-xl object-cover shadow-lg bg-white dark:bg-black"
                />
              </a>
              <span className="font-display font-bold text-lg text-foreground">Aanya AI</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Your digital soulmate & intelligent PC controller.
            </p>
          </div>

          <div>
            <h4 className="font-display font-semibold text-sm mb-4 text-foreground">Product</h4>
            <div className="flex flex-col gap-2">
              <Link to="/#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</Link>
              <Link to="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
              <Link to="/docs" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Documentation</Link>
            </div>
          </div>

          <div>
            <h4 className="font-display font-semibold text-sm mb-4 text-foreground">Legal</h4>
            <div className="flex flex-col gap-2">
              <Link to="/privacy-policy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link>
              <Link to="/terms-conditions" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms of Service</Link>
            </div>
          </div>

          <div>
            <h4 className="font-display font-semibold text-sm mb-4 text-foreground">Connect</h4>
            <div className="flex gap-3">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="h-9 w-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
                <Github size={18} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="h-9 w-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
                <Twitter size={18} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border text-center">
          <p className="text-xs text-muted-foreground">© 2026 Aanya AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
