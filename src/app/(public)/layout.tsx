import PublicHeader from "@/components/public/Header";

const PublicLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <PublicHeader />
      <div className="pt-16">{children}</div>
    </>
  );
};

export default PublicLayout;
