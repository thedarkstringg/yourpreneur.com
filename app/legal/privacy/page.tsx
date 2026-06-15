'use client';

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#020202] to-[#0a0a0a]">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Header */}
        <div className="mb-16 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-sm text-white/50 uppercase tracking-widest mb-8">Yourpreneur Canvas</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-xs text-white/40">
            <span>Effective Date: June 14, 2026</span>
            <span className="hidden sm:inline">•</span>
            <span>Last Updated: June 14, 2026</span>
          </div>
        </div>

        {/* Content */}
        <div className="legal-content space-y-12">
          <section>
            <h2 className="text-2xl font-bold text-white mb-6">1. Introduction</h2>
            <p className="text-white/70 leading-relaxed">
              Yourpreneur Canvas ("we", "us", "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, store, share, and protect your personal information when you use the Yourpreneur Canvas platform, including our web application, API, integrations, and related services.
            </p>
            <p className="text-white/70 leading-relaxed mt-4">
              This policy is written in plain language because we believe you deserve to know exactly what happens to your data. By using the Platform, you agree to the practices described in this Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-6">2. Who We Are & Scope</h2>
            <p className="text-white/70 leading-relaxed">
              This Privacy Policy applies to all users of Yourpreneur Canvas globally. If you are located in the European Economic Area (EEA), the United Kingdom, or California, additional rights and obligations may apply to you.
            </p>
            <p className="text-white/70 leading-relaxed mt-4">
              We act as the data controller for personal information we collect about you directly. For data you import from third-party integrations (Notion, GitHub, Linear, etc.), we act as a data processor on your behalf.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-6">3. Information We Collect</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">3.1 Information You Provide Directly</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-white font-medium mb-2">Account Information:</p>
                    <ul className="space-y-1 ml-6">
                      <li className="text-white/70 flex items-start">
                        <span className="text-white/40 mr-3">•</span>
                        <span>Full name, email address, password</span>
                      </li>
                      <li className="text-white/70 flex items-start">
                        <span className="text-white/40 mr-3">•</span>
                        <span>Profile avatar and timezone preferences</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <p className="text-white font-medium mb-2">Platform Content:</p>
                    <ul className="space-y-1 ml-6">
                      <li className="text-white/70 flex items-start">
                        <span className="text-white/40 mr-3">•</span>
                        <span>Venture names, descriptions, and events</span>
                      </li>
                      <li className="text-white/70 flex items-start">
                        <span className="text-white/40 mr-3">•</span>
                        <span>Tasks, notes, and canvas layout data</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <p className="text-white font-medium mb-2">Payment Information:</p>
                    <ul className="space-y-1 ml-6">
                      <li className="text-white/70 flex items-start">
                        <span className="text-white/40 mr-3">•</span>
                        <span>Billing name and address</span>
                      </li>
                      <li className="text-white/70 flex items-start">
                        <span className="text-white/40 mr-3">•</span>
                        <span>Payment card details (processed by Stripe)</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-2">3.2 Information We Collect Automatically</h3>
                <p className="text-white/70 leading-relaxed mb-3">
                  When you use the Platform, we automatically collect:
                </p>
                <div className="space-y-2 ml-6">
                  <p className="text-white/70 flex items-start">
                    <span className="text-white/40 mr-3">•</span>
                    <span><strong className="text-white">Usage data:</strong> Pages accessed, features used, timestamps</span>
                  </p>
                  <p className="text-white/70 flex items-start">
                    <span className="text-white/40 mr-3">•</span>
                    <span><strong className="text-white">Technical data:</strong> IP address, browser type, operating system</span>
                  </p>
                  <p className="text-white/70 flex items-start">
                    <span className="text-white/40 mr-3">•</span>
                    <span><strong className="text-white">Cookies:</strong> Authentication, preferences, and analytics</span>
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-2">3.3 Information from Third-Party Integrations</h3>
                <p className="text-white/70 leading-relaxed">
                  When you connect an Integration Service (Notion, GitHub, Linear, Vercel, Product Hunt), we receive limited data from that service to populate your venture timeline. We access only what is necessary for the integration to function. You may revoke any integration at any time.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-6">4. How We Use Your Information</h2>
            <div className="space-y-4">
              <p className="text-white/70 leading-relaxed">
                We use your information for the following purposes:
              </p>
              <ul className="space-y-3 ml-6">
                <li className="text-white/70 flex items-start">
                  <span className="text-white/40 mr-3">•</span>
                  <span><strong className="text-white">To provide the Platform:</strong> Store your data, authenticate access, process requests</span>
                </li>
                <li className="text-white/70 flex items-start">
                  <span className="text-white/40 mr-3">•</span>
                  <span><strong className="text-white">To process payments:</strong> Manage subscriptions and charges via Stripe</span>
                </li>
                <li className="text-white/70 flex items-start">
                  <span className="text-white/40 mr-3">•</span>
                  <span><strong className="text-white">To communicate:</strong> Send transactional emails and product updates</span>
                </li>
                <li className="text-white/70 flex items-start">
                  <span className="text-white/40 mr-3">•</span>
                  <span><strong className="text-white">To improve the Platform:</strong> Analyze aggregated usage patterns</span>
                </li>
                <li className="text-white/70 flex items-start">
                  <span className="text-white/40 mr-3">•</span>
                  <span><strong className="text-white">To ensure security:</strong> Detect fraud and unauthorized access</span>
                </li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-6">5. How We Share Your Information</h2>
            <p className="text-white/70 leading-relaxed mb-4">
              We do not sell your personal information. We share your data only in limited circumstances:
            </p>
            <div className="space-y-3 ml-6">
              <p className="text-white/70 flex items-start">
                <span className="text-white/40 mr-3">•</span>
                <span><strong className="text-white">Service Providers:</strong> Supabase (database), Stripe (payments), SendGrid (email), Vercel (hosting)</span>
              </p>
              <p className="text-white/70 flex items-start">
                <span className="text-white/40 mr-3">•</span>
                <span><strong className="text-white">Integration Services:</strong> When you explicitly connect them</span>
              </p>
              <p className="text-white/70 flex items-start">
                <span className="text-white/40 mr-3">•</span>
                <span><strong className="text-white">Public Canvas:</strong> If you choose to make your canvas publicly accessible</span>
              </p>
              <p className="text-white/70 flex items-start">
                <span className="text-white/40 mr-3">•</span>
                <span><strong className="text-white">Legal Requirements:</strong> If required by law or court order</span>
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-6">6. Data Security</h2>
            <p className="text-white/70 leading-relaxed mb-4">
              We implement industry-standard security measures:
            </p>
            <ul className="space-y-2 ml-6 mb-4">
              <li className="text-white/70 flex items-start">
                <span className="text-white/40 mr-3">•</span>
                <span>Encryption in transit using TLS 1.2 or higher</span>
              </li>
              <li className="text-white/70 flex items-start">
                <span className="text-white/40 mr-3">•</span>
                <span>Encrypted data storage</span>
              </li>
              <li className="text-white/70 flex items-start">
                <span className="text-white/40 mr-3">•</span>
                <span>Passwords hashed using bcrypt</span>
              </li>
              <li className="text-white/70 flex items-start">
                <span className="text-white/40 mr-3">•</span>
                <span>Access controls following principle of least privilege</span>
              </li>
              <li className="text-white/70 flex items-start">
                <span className="text-white/40 mr-3">•</span>
                <span>Monitoring for suspicious access patterns</span>
              </li>
            </ul>
            <p className="text-white/70 leading-relaxed">
              Despite these measures, no system is perfectly secure. To report a security vulnerability, email <a href="mailto:security@yourpreneurcanvas.com" className="text-white underline hover:text-white/80">security@yourpreneurcanvas.com</a>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-6">7. Data Retention</h2>
            <p className="text-white/70 leading-relaxed mb-4">
              We retain your information for as long as necessary to provide services and comply with legal obligations:
            </p>
            <ul className="space-y-2 ml-6">
              <li className="text-white/70 flex items-start">
                <span className="text-white/40 mr-3">•</span>
                <span><strong className="text-white">Active accounts:</strong> Data retained while account is active</span>
              </li>
              <li className="text-white/70 flex items-start">
                <span className="text-white/40 mr-3">•</span>
                <span><strong className="text-white">After deletion:</strong> Data retained for 30 days, then permanently deleted</span>
              </li>
              <li className="text-white/70 flex items-start">
                <span className="text-white/40 mr-3">•</span>
                <span><strong className="text-white">Backups:</strong> May persist for up to 90 days after deletion</span>
              </li>
              <li className="text-white/70 flex items-start">
                <span className="text-white/40 mr-3">•</span>
                <span><strong className="text-white">Financial records:</strong> Retained for 7 years as required by law</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-6">8. Your Rights</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">EEA & UK Users (GDPR)</h3>
                <p className="text-white/70 leading-relaxed mb-2">
                  You have the following rights:
                </p>
                <ul className="space-y-2 ml-6">
                  <li className="text-white/70 flex items-start">
                    <span className="text-white/40 mr-3">•</span>
                    <span>Right of Access — Request a copy of your data</span>
                  </li>
                  <li className="text-white/70 flex items-start">
                    <span className="text-white/40 mr-3">•</span>
                    <span>Right to Rectification — Correct inaccurate data</span>
                  </li>
                  <li className="text-white/70 flex items-start">
                    <span className="text-white/40 mr-3">•</span>
                    <span>Right to Erasure — Request deletion of your data</span>
                  </li>
                  <li className="text-white/70 flex items-start">
                    <span className="text-white/40 mr-3">•</span>
                    <span>Right to Data Portability — Export data in machine-readable format</span>
                  </li>
                  <li className="text-white/70 flex items-start">
                    <span className="text-white/40 mr-3">•</span>
                    <span>Right to Object — Object to processing based on legitimate interests</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-2">California Residents (CCPA)</h3>
                <p className="text-white/70 leading-relaxed mb-2">
                  You have the right to know, delete, correct, and opt-out of sale or sharing of your personal information. We do not sell or share your information.
                </p>
              </div>

              <p className="text-white/70 leading-relaxed mt-4">
                To exercise any of these rights, contact us at <a href="mailto:privacy@yourpreneurcanvas.com" className="text-white underline hover:text-white/80">privacy@yourpreneurcanvas.com</a>. We will respond within 30 days.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-6">9. Cookies</h2>
            <p className="text-white/70 leading-relaxed mb-4">
              We use the following cookies:
            </p>
            <div className="space-y-2 ml-6 mb-4">
              <p className="text-white/70 flex items-start">
                <span className="text-white/40 mr-3">•</span>
                <span><strong className="text-white">Authentication:</strong> Keep you signed in</span>
              </p>
              <p className="text-white/70 flex items-start">
                <span className="text-white/40 mr-3">•</span>
                <span><strong className="text-white">Functional:</strong> Remember your preferences (zoom, sidebar state)</span>
              </p>
              <p className="text-white/70 flex items-start">
                <span className="text-white/40 mr-3">•</span>
                <span><strong className="text-white">Analytics:</strong> Understand how the Platform is used</span>
              </p>
            </div>
            <p className="text-white/70 leading-relaxed">
              We do not use advertising cookies or cross-site tracking cookies. You can control cookies through your browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-6">10. Children's Privacy</h2>
            <p className="text-white/70 leading-relaxed">
              Yourpreneur Canvas is not directed at children under 16. We do not knowingly collect information from anyone under 16. If we become aware of such collection, we will delete that information promptly.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-6">11. Changes to This Policy</h2>
            <p className="text-white/70 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you by email and display a prominent notice on the Platform at least 14 days before material changes take effect. Your continued use of the Platform constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-6">12. Contact</h2>
            <p className="text-white/70 leading-relaxed mb-4">
              For privacy matters, contact us at:
            </p>
            <div className="space-y-2 text-white/70">
              <p><strong className="text-white">Privacy & Data Protection</strong></p>
              <p><a href="mailto:privacy@yourpreneurcanvas.com" className="text-white underline hover:text-white/80">privacy@yourpreneurcanvas.com</a></p>
              <p><a href="mailto:security@yourpreneurcanvas.com" className="text-white underline hover:text-white/80">security@yourpreneurcanvas.com</a></p>
              <p><a href="mailto:support@yourpreneurcanvas.com" className="text-white underline hover:text-white/80">support@yourpreneurcanvas.com</a></p>
            </div>
            <p className="text-white/70 leading-relaxed mt-4">
              We aim to respond to all privacy inquiries within 3 business days.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
