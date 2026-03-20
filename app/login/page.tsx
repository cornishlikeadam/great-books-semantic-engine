import { AuthForm } from "@/components/auth/auth-form";

export default function LoginPage() {
  return (
    <main className="page-wrap narrow">
      <section className="panel">
        <p className="eyebrow">User access</p>
        <h1>Login or create your researcher account</h1>
        <p>
          Cloud analyses are tied to a user account so the app can meter the first three free runs
          and then route you into billing if you keep going.
        </p>
        <AuthForm />
      </section>
    </main>
  );
}
