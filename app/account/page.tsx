import { AccountDashboard } from "@/components/auth/account-dashboard";

export default function AccountPage() {
  return (
    <main className="page-wrap">
      <section className="container">
        <div className="section-head">
          <div>
            <p className="eyebrow">Usage</p>
            <h1>Your account and analysis history</h1>
          </div>
        </div>

        <AccountDashboard />
      </section>
    </main>
  );
}
