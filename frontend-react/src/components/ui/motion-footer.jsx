import { MapPin, Mail, Github, Twitter, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";

const NAV_COLS = [
  {
    heading: "Product",
    links: [
      { label: "Whiteboard",   href: "/board" },
      { label: "Video Calls",  href: "#product" },
      { label: "Live Chat",    href: "#product" },
      { label: "Pricing",      href: "#pricing" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "Why Plixa",    href: "#features" },
      { label: "Features",     href: "#product" },
      { label: "Testimonials", href: "#testimonials" },
      { label: "Blog",         href: "#" },
    ],
  },
  {
    heading: "Support",
    links: [
      { label: "Contact Us",      href: "mailto:hello@plixa.io" },
      { label: "Privacy Policy",  href: "#" },
      { label: "Terms of Service",href: "#" },
      { label: "Status",          href: "#" },
    ],
  },
];

const SOCIAL = [
  { icon: Twitter,  href: "https://x.com",           label: "X / Twitter" },
  { icon: Linkedin, href: "https://linkedin.com",     label: "LinkedIn" },
  { icon: Github,   href: "https://github.com",       label: "GitHub" },
];

export function CinematicFooter() {
  return (
    <footer className="border-t border-border/60 bg-background text-foreground">
      <div className="mx-auto max-w-5xl px-6 py-14">

        {/* Main grid: info col + 3 nav cols */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">

          {/* ── Brand + contact ── */}
          <div className="flex flex-col gap-6">
            {/* Logo */}
            <Link to="/" className="inline-flex items-center gap-2 w-fit">
              <img src={logo} alt="Plixa" className="h-7 w-auto" />
              <span className="text-base font-bold tracking-tight text-foreground">Plixa</span>
            </Link>

            {/* Contact info */}
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />
                <span>Bengaluru, Karnataka, India</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />
                <a href="mailto:hello@plixa.io" className="hover:text-foreground transition-colors">
                  hello@plixa.io
                </a>
              </li>
            </ul>

            {/* Social icons */}
            <div className="flex items-center gap-2">
              {SOCIAL.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground hover:border-primary/40 hover:text-foreground transition-all duration-200"
                >
                  <Icon className="h-3.5 w-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* ── Nav columns ── */}
          {NAV_COLS.map((col) => (
            <div key={col.heading}>
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-foreground">
                {col.heading}
              </p>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith("/") ? (
                      <Link
                        to={link.href}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-150"
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-150"
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Bottom bar ── */}
        <div className="mt-12 border-t border-border/40 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            © 2026 Plixa, Inc. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Engineered for real-time collaboration.
          </p>
        </div>

      </div>
    </footer>
  );
}
