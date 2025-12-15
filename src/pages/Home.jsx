import Navbar from "../components/Navbar";
import Footer from "../components/Footer";


export default function Home() {
  return (
    <>
      <Navbar />

      {/* HERO SECTION */}
      <section className="text-center py-24 px-6 bg-gray-50">
        <h1 className="text-4xl font-extrabold mb-6">
          Your money. Protected by people you trust.
        </h1>

        <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-8">
          Create a wallet where spending money requires approval from guardians you choose.
        </p>

        <div className="flex justify-center gap-4">
          <button className="bg-black text-white px-6 py-3 rounded-lg">
            Create Free Wallet
          </button>
          <button className="border px-6 py-3 rounded-lg">
            How it works
          </button>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 px-8">
        <h2 className="text-3xl font-bold text-center mb-12">
          How It Works
        </h2>

        <div className="grid md:grid-cols-3 gap-10 text-center">
          <div>
            <h3 className="font-semibold text-xl mb-2">Create a Wallet</h3>
            <p className="text-gray-600">
              Set up your wallet and define spending rules.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-xl mb-2">Add Guardians</h3>
            <p className="text-gray-600">
              Choose trusted people to approve withdrawals.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-xl mb-2">Spend Safely</h3>
            <p className="text-gray-600">
              Money moves only when approval rules are met.
            </p>
          </div>
        </div>
      </section>

      {/* WHY DIFFERENT */}
      <section className="bg-gray-50 py-20 px-8">
        <h2 className="text-3xl font-bold text-center mb-12">
          Why This Is Different
        </h2>

        <div className="grid md:grid-cols-2 gap-10 max-w-4xl mx-auto">
          <div className="border p-6 rounded-lg">
            <h3 className="font-semibold text-lg mb-3">Normal Wallets 😬</h3>
            <ul className="text-gray-600 list-disc pl-5">
              <li>One PIN controls everything</li>
              <li>Easy impulse spending</li>
              <li>Higher fraud risk</li>
            </ul>
          </div>

          <div className="border p-6 rounded-lg bg-white">
            <h3 className="font-semibold text-lg mb-3">Guarded Wallet ✅</h3>
            <ul className="text-gray-600 list-disc pl-5">
              <li>Multi-approval protection</li>
              <li>Custom spending limits</li>
              <li>Shared accountability</li>
            </ul>
          </div>
        </div>
      </section>

      {/* USE CASES */}
      <section className="py-20 px-8">
        <h2 className="text-3xl font-bold text-center mb-12">
          Use Cases
        </h2>

        <div className="grid md:grid-cols-4 gap-6 text-center">
          <div className="border p-6 rounded-lg">👨‍👩‍👧<br />Family Savings</div>
          <div className="border p-6 rounded-lg">🎓<br />Student Allowance</div>
          <div className="border p-6 rounded-lg">🏢<br />Business Expenses</div>
          <div className="border p-6 rounded-lg">🧠<br />Self-Control Wallet</div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-black text-white text-center py-20 px-6">
        <h2 className="text-3xl font-bold mb-6">
          Start controlling money the smarter way
        </h2>

        <button className="bg-white text-black px-6 py-3 rounded-lg">
          Create Your Free Wallet
        </button>

        <p className="text-gray-300 mt-4">
          No real money required. Try the demo system.
        </p>
      </section>

      <Footer />
    </>
  );
}
