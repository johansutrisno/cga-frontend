import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { BookMarked } from 'lucide-react'
import Link from 'next/link'

export const Header = () => {
    return (
        <nav className="bg-background border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/" className="text-2xl font-bold text-primary">
                            Logo
                        </Link>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Button variant="outline">
                            <BookMarked className="mr-2 h-4 w-4" /> My Captions
                        </Button>
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