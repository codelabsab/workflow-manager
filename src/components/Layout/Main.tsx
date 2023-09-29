import React from "react";

type MainProps = {
  children: React.ReactNode;
};

const Main = ({ children }: MainProps) => {
  return (
    <div className="px-5">
      <div className="container mx-auto mb-20 flex min-h-full flex-col items-center">
        <main className="flex w-full flex-col gap-3 pt-3 sm:gap-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Main;
