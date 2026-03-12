export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-orbitron font-black mb-8 glow-text">
          PRIVACY POLICY
        </h1>
        
        <div className="glass-effect rounded-xl p-8 space-y-6 font-rajdhani text-gray-300">
          <section>
            <h2 className="text-2xl font-orbitron font-bold text-white mb-4">
              1. Information We Collect
            </h2>
            <p className="leading-relaxed">
              We collect information you provide directly to us through Discord OAuth authentication,
              including your Discord user ID, username, discriminator, and avatar. We also collect
              access tokens necessary for server joining functionality.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-orbitron font-bold text-white mb-4">
              2. How We Use Your Information
            </h2>
            <p className="leading-relaxed">
              Your information is used to authenticate your identity, provide access to our platform,
              and enable server joining features. We store this data securely in an encrypted SQLite
              database.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-orbitron font-bold text-white mb-4">
              3. Data Security
            </h2>
            <p className="leading-relaxed">
              We implement industry-standard security measures to protect your data. All authentication
              tokens are encrypted and stored securely. We use HTTPS for all data transmission.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-orbitron font-bold text-white mb-4">
              4. Your Rights
            </h2>
            <p className="leading-relaxed">
              You have the right to access, modify, or delete your personal data at any time. You can
              logout to remove your session data, and contact us to request full data deletion.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-orbitron font-bold text-white mb-4">
              5. Contact
            </h2>
            <p className="leading-relaxed">
              For privacy-related inquiries, please contact us through our Discord server or via
              email at privacy@archiveant.org
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
