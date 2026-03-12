export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-orbitron font-black mb-8 glow-text">
          TERMS OF SERVICE
        </h1>
        
        <div className="glass-effect rounded-xl p-8 space-y-6 font-rajdhani text-gray-300">
          <section>
            <h2 className="text-2xl font-orbitron font-bold text-white mb-4">
              1. Acceptance of Terms
            </h2>
            <p className="leading-relaxed">
              By accessing and using Archive Industries platform, you accept and agree to be bound
              by the terms and provision of this agreement. If you do not agree to these terms,
              please do not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-orbitron font-bold text-white mb-4">
              2. Use License
            </h2>
            <p className="leading-relaxed">
              Permission is granted to temporarily access the materials on Archive Industries
              platform for personal, non-commercial transitory viewing only. This is the grant
              of a license, not a transfer of title.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-orbitron font-bold text-white mb-4">
              3. User Accounts
            </h2>
            <p className="leading-relaxed">
              You are responsible for maintaining the confidentiality of your account and for all
              activities that occur under your account. You agree to notify us immediately of any
              unauthorized use of your account.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-orbitron font-bold text-white mb-4">
              4. Discord Integration
            </h2>
            <p className="leading-relaxed">
              By using our Discord OAuth authentication, you grant us permission to access your
              Discord profile information and join servers on your behalf as specified during
              the authorization process.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-orbitron font-bold text-white mb-4">
              5. Prohibited Uses
            </h2>
            <p className="leading-relaxed">
              You may not use our platform for any illegal or unauthorized purpose. You must not
              transmit any worms, viruses, or any code of a destructive nature. Violation of any
              terms will result in immediate termination of your account.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-orbitron font-bold text-white mb-4">
              6. Limitation of Liability
            </h2>
            <p className="leading-relaxed">
              Archive Industries shall not be held liable for any damages arising from the use
              or inability to use our services, even if we have been notified of the possibility
              of such damages.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-orbitron font-bold text-white mb-4">
              7. Modifications
            </h2>
            <p className="leading-relaxed">
              We reserve the right to modify these terms at any time. Continued use of the platform
              after changes constitutes acceptance of the modified terms.
            </p>
          </section>

          <p className="text-sm text-gray-500 mt-8">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}
