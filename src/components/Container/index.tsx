type ContainerProps = {
  children: React.ReactNode;
};

export function Container({ children }: ContainerProps) {
  return (
    <div className="mx-auto w-full max-w-6xl px-3 sm:px-6 lg:px-8">
      {children}
    </div>
  );
}
