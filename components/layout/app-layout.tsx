import { Header } from "@/components/shared/header";

interface AppLayoutProps {
    children: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 w-full max-w-7xl mx-auto p-4">
                {children}
            </main>
        </div>
    );
};

export default AppLayout;