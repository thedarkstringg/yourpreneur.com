'use client';

export default function TermsPage() {
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
            Terms of Service
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
            <h2 className="text-2xl font-bold text-white mb-6">1. Introduction & Acceptance</h2>
            <p className="text-white/70 leading-relaxed mb-4">
              Welcome to Yourpreneur Canvas ("Platform", "we", "us", or "our"). By creating an account, accessing, or using any part of the Yourpreneur Canvas platform — including the web application, API, integrations, and any related services — you ("Founder", "User", "you") agree to be bound by these Terms of Service ("Terms").
            </p>
            <p className="text-white/70 leading-relaxed mb-4">
              Please read these Terms carefully. If you do not agree to any part of these Terms, you must not access or use the Platform. Your continued use of the Platform following any updates to these Terms constitutes your acceptance of those changes.
            </p>
            <p className="text-white/70 leading-relaxed">
              These Terms constitute a legally binding agreement between you and Yourpreneur Canvas. If you are using the Platform on behalf of a company or organization, you represent that you have the authority to bind that entity to these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-6">2. Eligibility</h2>
            <p className="text-white/70 leading-relaxed mb-4">
              You must be at least 16 years of age to use Yourpreneur Canvas. By using the Platform, you represent and warrant that:
            </p>
            <ul className="space-y-3 ml-6">
              <li className="text-white/70 leading-relaxed flex items-start">
                <span className="text-white/40 mr-3">•</span>
                <span>You are at least 16 years old</span>
              </li>
              <li className="text-white/70 leading-relaxed flex items-start">
                <span className="text-white/40 mr-3">•</span>
                <span>You have the legal capacity to enter into a binding agreement</span>
              </li>
              <li className="text-white/70 leading-relaxed flex items-start">
                <span className="text-white/40 mr-3">•</span>
                <span>You are not prohibited by any applicable law from using the Platform</span>
              </li>
              <li className="text-white/70 leading-relaxed flex items-start">
                <span className="text-white/40 mr-3">•</span>
                <span>All information you provide to us is accurate, current, and complete</span>
              </li>
              <li className="text-white/70 leading-relaxed flex items-start">
                <span className="text-white/40 mr-3">•</span>
                <span>You will maintain the accuracy of your account information</span>
              </li>
            </ul>
            <p className="text-white/70 leading-relaxed mt-4">
              If you are under 18 years of age, you represent that you have obtained consent from a parent or legal guardian to use the Platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-6">3. Account Registration & Security</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">3.1 Account Creation</h3>
                <p className="text-white/70 leading-relaxed">
                  To access the core features of Yourpreneur Canvas, you must create an account. You agree to provide accurate, truthful, and complete information during registration and to keep this information updated at all times.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">3.2 Account Credentials</h3>
                <p className="text-white/70 leading-relaxed">
                  You are solely responsible for maintaining the confidentiality of your account credentials, including your password. You agree not to share your credentials with any third party. We recommend using a strong, unique password and enabling any two-factor authentication options we may provide.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">3.3 Account Activity</h3>
                <p className="text-white/70 leading-relaxed">
                  You are fully responsible for all activity that occurs under your account, whether or not authorized by you. If you suspect any unauthorized access to or use of your account, you must notify us immediately at <a href="mailto:security@yourpreneurcanvas.com" className="text-white underline hover:text-white/80">security@yourpreneurcanvas.com</a>. We will not be liable for any loss or damage arising from unauthorized use of your account.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-6">4. Subscription Plans & Billing</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">4.1 Free Tier</h3>
                <p className="text-white/70 leading-relaxed mb-3">
                  Yourpreneur Canvas offers a free tier ("Free Plan") with the following limitations:
                </p>
                <ul className="space-y-2 ml-6">
                  <li className="text-white/70 flex items-start">
                    <span className="text-white/40 mr-3">•</span>
                    <span>Maximum of 3 ventures</span>
                  </li>
                  <li className="text-white/70 flex items-start">
                    <span className="text-white/40 mr-3">•</span>
                    <span>Maximum of 20 events per venture</span>
                  </li>
                  <li className="text-white/70 flex items-start">
                    <span className="text-white/40 mr-3">•</span>
                    <span>1 integration connection</span>
                  </li>
                  <li className="text-white/70 flex items-start">
                    <span className="text-white/40 mr-3">•</span>
                    <span>Current year canvas view only</span>
                  </li>
                  <li className="text-white/70 flex items-start">
                    <span className="text-white/40 mr-3">•</span>
                    <span>Limited live feed (last 10 events)</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">4.2 Premium Plan</h3>
                <p className="text-white/70 leading-relaxed">
                  The Premium Plan ("Pro Plan") provides unlimited access to all Platform features as described on our pricing page. The Pro Plan is billed monthly or annually, as selected at the time of purchase.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">4.3 Refunds</h3>
                <p className="text-white/70 leading-relaxed">
                  We offer a 14-day refund window for new Pro Plan subscribers. If you are not satisfied with the Pro Plan within 14 days of your first charge, contact us at <a href="mailto:billing@yourpreneurcanvas.com" className="text-white underline hover:text-white/80">billing@yourpreneurcanvas.com</a> for a full refund. After this period, all charges are non-refundable except as required by applicable law.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-6">5. Acceptable Use Policy</h2>
            <p className="text-white/70 leading-relaxed mb-4">
              You agree not to use the Platform for unlawful purposes or in violation of any law. This includes but is not limited to:
            </p>
            <ul className="space-y-2 ml-6 mb-4">
              <li className="text-white/70 flex items-start">
                <span className="text-white/40 mr-3">•</span>
                <span>Attempting unauthorized access to any part of the Platform</span>
              </li>
              <li className="text-white/70 flex items-start">
                <span className="text-white/40 mr-3">•</span>
                <span>Transmitting malicious code or malware</span>
              </li>
              <li className="text-white/70 flex items-start">
                <span className="text-white/40 mr-3">•</span>
                <span>Scraping or extracting data without permission</span>
              </li>
              <li className="text-white/70 flex items-start">
                <span className="text-white/40 mr-3">•</span>
                <span>Reverse engineering or attempting to discover source code</span>
              </li>
              <li className="text-white/70 flex items-start">
                <span className="text-white/40 mr-3">•</span>
                <span>Using the Platform to store illegal or infringing content</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-6">6. Intellectual Property</h2>
            <p className="text-white/70 leading-relaxed mb-4">
              The Platform, including all software, design, and content, is owned by or licensed to Yourpreneur Canvas and protected by intellectual property laws. You may not use our trademarks or proprietary materials without consent.
            </p>
            <p className="text-white/70 leading-relaxed">
              You retain full ownership of all content you submit to the Platform. By submitting content, you grant us a limited, non-exclusive license to store, display, and process it solely to provide the Platform services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-6">7. Third-Party Integrations</h2>
            <p className="text-white/70 leading-relaxed mb-4">
              Yourpreneur Canvas allows you to connect third-party services including Notion, GitHub, Linear, Vercel, and Product Hunt. Your use of these services is subject to their respective terms and privacy policies.
            </p>
            <p className="text-white/70 leading-relaxed">
              When you connect an integration, you authorize us to access and display data from that service as directed by you. We access only the data necessary for integration functionality. You may revoke any integration at any time through your settings.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-6">8. Disclaimers</h2>
            <p className="text-white/70 leading-relaxed mb-4">
              The Platform is provided on an "as is" basis without warranty of any kind. To the fullest extent permitted by law, we disclaim all warranties, express or implied, including warranties of merchantability and fitness for a particular purpose.
            </p>
            <p className="text-white/70 leading-relaxed mb-4">
              Yourpreneur Canvas is a productivity tool. Nothing on the Platform constitutes business, financial, legal, or investment advice. You should not rely on Platform-generated content as a substitute for professional advice.
            </p>
            <p className="text-white/70 leading-relaxed">
              We do not guarantee uninterrupted access to the Platform. We may experience downtime due to maintenance or technical issues beyond our control.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-6">9. Limitation of Liability</h2>
            <p className="text-white/70 leading-relaxed mb-4">
              To the maximum extent permitted by law, Yourpreneur Canvas will not be liable for indirect, incidental, consequential, or punitive damages, including loss of profits, revenue, or data.
            </p>
            <p className="text-white/70 leading-relaxed">
              Our total aggregate liability will not exceed the greater of: (a) the amount you paid to us in the 12 months preceding the claim, or (b) $50 USD.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-6">10. Termination</h2>
            <p className="text-white/70 leading-relaxed mb-4">
              You may close your account at any time through your account settings. We reserve the right to suspend or terminate your access if we reasonably believe you have violated these Terms or engaged in fraudulent activity.
            </p>
            <p className="text-white/70 leading-relaxed">
              Upon termination, your right to use the Platform ceases immediately. We will retain your data for 30 days following termination to allow for data export requests, after which we may permanently delete your account and associated data.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-6">11. Governing Law & Disputes</h2>
            <p className="text-white/70 leading-relaxed">
              These Terms are governed by the laws of the jurisdiction in which Yourpreneur Canvas is registered. Any disputes will first be attempted to be resolved through good-faith negotiation. If negotiation fails, disputes will be resolved through binding arbitration.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-6">12. Contact</h2>
            <p className="text-white/70 leading-relaxed mb-4">
              For questions about these Terms, contact us at:
            </p>
            <div className="space-y-2 text-white/70">
              <p><strong className="text-white">Yourpreneur Canvas</strong></p>
              <p><a href="mailto:legal@yourpreneurcanvas.com" className="text-white underline hover:text-white/80">legal@yourpreneurcanvas.com</a></p>
              <p><a href="mailto:support@yourpreneurcanvas.com" className="text-white underline hover:text-white/80">support@yourpreneurcanvas.com</a></p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
