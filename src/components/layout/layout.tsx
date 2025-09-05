import Navbar from "./navbar";

export default function Layout({
  children,
  screenClassName = "",
  className = "",
  isNoSpacing = false,
}: {
  children: React.ReactNode;
  screenClassName?: string;
  className?: string;
  isNoSpacing?: boolean;
}) {
  return (
    <div>
      <Navbar />
      <div
        className={`flex flex-row bg-gray-50 min-h-[100dvh] justify-center ${screenClassName}`}
      >
        <div
          className={`flex flex-col w-full h-full bg-gray-50 max-w-5xl ${
            !isNoSpacing ? "px-2 sm:px-6 md:px-10 xl:px-14" : ""
          } ${className}`}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
