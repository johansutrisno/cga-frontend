'use client';

import { Header } from "@/components/shared/header";
import { usePathname } from "next/navigation";

const HeaderWrapper = () => {
    const pathname = usePathname();
    const noHeaderPaths = ['/sign-in', '/sign-up'];
    const shouldShowHeader = !noHeaderPaths.includes(pathname);

    if (!shouldShowHeader) return null;
    return <Header />;
};

export default HeaderWrapper;