type ContainerProps = {
  children: React.ReactNode;
};

export function Container({ children }: ContainerProps) {
  return (
    <div className="mx-auto w-full max-w-[1520px] px-4 sm:px-6 lg:px-10 2xl:px-12">
      {children}
    </div>
  );
}
