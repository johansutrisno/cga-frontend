import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { BookMarked } from 'lucide-react'
import Link from 'next/link'
import { useUser } from "@clerk/nextjs";

export const Header = () => {
    const { user } = useUser();
    let href = user ? '/my-captions' : '/sign-in'

    return (
        <nav className="bg-background border-b">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between h-16">
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/" className="text-2xl font-bold text-primary">
                            CGA
                        </Link>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Link href={href}>
                            <Button variant="outline">
                                <BookMarked className="mr-2 h-4 w-4" /> My Captions
                            </Button>
                        </Link>
                        <SignedOut>
                            <SignInButton>
                                <Button>Sign In</Button>
                            </SignInButton>
                        </SignedOut>
                        <SignedIn>
                            <UserButton />
                        </SignedIn>
                    </div>
                </div>
            </div>
        </nav>
    );
}