

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <main>{children}</main>
    </div>
  );
}

    //   <div className="md:hidden">
    //     <div className="flex h-24 items-center px-2 md:px-8 xl:px-12 2xl:px-20 justify-between">
    //         {/* <Image className="" src="/you.png" alt="logo" width={125} height={100} /> */}
    //         {/* <MobileNav /> */}
    //     </div>
    //   </div>
    //   <div className="hidden flex-col md:flex">
    //     <div className="flex h-24 items-center px-2 md:px-8 xl:px-12 2xl:px-20 justify-between">
    //         {/* <Image src="/you.png" alt="logo" width={125} height={100} /> */}
    //         <div className="ml-auto flex items-center">
    //             {/* <MainNav /> */}
    //         </div>
    //     </div>
    //   </div>