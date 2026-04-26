import React from 'react';
import { Link } from 'react-router-dom';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { MenuToggleIcon } from '@/components/ui/menu-toggle-icon';
import { useScroll } from '@/components/ui/use-scroll';
import { ThemeToggle } from '@/components/theme-toggle';
import logo from '../../assets/logo.png';

const links = [
    { label: 'Why Plixa', href: '#features' },
    { label: 'Features', href: '#product' },
    { label: 'Testimonials', href: '#testimonials' },
    { label: 'Pricing', href: '#pricing' },
];

export function Header() {
    const [open, setOpen] = React.useState(false);
    const scrolled = useScroll(10);

    React.useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [open]);

    return (
        <header
            className={cn(
                'sticky top-0 z-50 mx-auto w-full max-w-5xl border-b border-transparent md:rounded-md md:border md:transition-all md:ease-out',
                {
                    'bg-background/95 supports-[backdrop-filter]:bg-background/50 border-border backdrop-blur-lg md:top-4 md:max-w-4xl md:shadow':
                        scrolled && !open,
                    'bg-background/90': open,
                },
            )}
        >
            <nav
                className={cn(
                    'flex h-14 w-full items-center justify-between px-4 md:h-12 md:transition-all md:ease-out',
                    { 'md:px-2': scrolled },
                )}
            >
                {/* Logo */}
                <Link
                    to="/"
                    aria-label="home"
                    className="flex items-center gap-2 shrink-0"
                >
                    <img src={logo} alt="Plixa Logo" className="h-7 w-auto" />
                    <span className="text-lg font-bold tracking-tight text-foreground">
                        Plixa
                    </span>
                </Link>

                {/* Desktop nav */}
                <div className="hidden items-center gap-1 md:flex">
                    {links.map((link, i) => (
                        <a
                            key={i}
                            className={buttonVariants({ variant: 'ghost', size: 'sm' })}
                            href={link.href}
                        >
                            {link.label}
                        </a>
                    ))}

                    <div className="mx-2 h-4 w-px bg-border" />

                    <ThemeToggle />

                    <Button variant="ghost" size="sm" asChild>
                        <Link to="/auth">Sign In</Link>
                    </Button>
                    <Button size="sm" className="rounded-lg" asChild>
                        <Link to="/board">Start Whiteboarding</Link>
                    </Button>
                </div>

                {/* Mobile hamburger */}
                <Button
                    size="icon"
                    variant="outline"
                    onClick={() => setOpen(!open)}
                    className="md:hidden"
                    aria-label={open ? 'Close menu' : 'Open menu'}
                >
                    <MenuToggleIcon open={open} className="size-5" duration={300} />
                </Button>
            </nav>

            {/* Mobile full-screen menu */}
            <div
                className={cn(
                    'bg-background/95 fixed top-14 right-0 bottom-0 left-0 z-50 flex flex-col overflow-hidden border-y backdrop-blur-md md:hidden',
                    open ? 'block' : 'hidden',
                )}
            >
                <div
                    data-slot={open ? 'open' : 'closed'}
                    className={cn(
                        'data-[slot=open]:animate-in data-[slot=open]:zoom-in-95 data-[slot=closed]:animate-out data-[slot=closed]:zoom-out-95 ease-out',
                        'flex h-full w-full flex-col justify-between gap-y-2 p-4',
                    )}
                >
                    <div className="grid gap-y-1">
                        {links.map((link) => (
                            <a
                                key={link.label}
                                className={buttonVariants({
                                    variant: 'ghost',
                                    className: 'justify-start text-base',
                                })}
                                href={link.href}
                                onClick={() => setOpen(false)}
                            >
                                {link.label}
                            </a>
                        ))}
                    </div>

                    <div className="flex flex-col gap-2">
                        <div className="flex justify-end pb-1">
                            <ThemeToggle />
                        </div>
                        <Button variant="outline" className="w-full" asChild>
                            <Link to="/auth" onClick={() => setOpen(false)}>
                                Sign In
                            </Link>
                        </Button>
                        <Button className="w-full" asChild>
                            <Link to="/board" onClick={() => setOpen(false)}>
                                Start Whiteboarding
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    );
}
