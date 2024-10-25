import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'

export const Header = () => {
    return (
        <header className="w-full p-4 border-b">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <div className="text-xl font-bold">Logo</div>
                <SignedOut>
                    <SignInButton>
                        <Button>Sign In</Button>
                    </SignInButton>
                </SignedOut>
                <SignedIn>
                    <UserButton />
                </SignedIn>
            </div>
        </header>
    );
}