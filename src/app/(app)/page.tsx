import { requireUser } from "@/lib/auth/session";

const HomePage = async () => {
  const session = await requireUser();

  return (
    <section className="space-y-2">
      <h1 className="text-3xl font-semibold">Welcome, {session.user.name}</h1>
      <p className="text-muted-foreground">
        Role:{" "}
        <span className="text-foreground capitalize">
          {session.user.role ?? "member"}
        </span>
      </p>
    </section>
  );
};

export default HomePage;
