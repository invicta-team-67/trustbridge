import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { Loader2, Building2, Briefcase, Phone, ArrowLeft } from "lucide-react";

export default function ProfileSetup() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const [formData, setFormData] = useState({
    businessName: "",
    sector: "",
    contact: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // Get current user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        throw new Error("You must be logged in to create a profile");
      }

      // Insert profile data
      const { error } = await supabase.from("profiles").insert({
        user_id: user.id,
        business_name: formData.businessName,
        sector: formData.sector,
        contact: formData.contact,
      });

      if (error) throw error;

      setMessage({ type: "success", text: "Profile created successfully!" });

      // Redirect to dashboard after 1 second
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 p-4">
      <main className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          {/* Header */}
          <header className="space-y-2 text-center">
            <h1 className="text-3xl font-bold text-slate-900">
              Complete Your Profile
            </h1>
            <p className="text-slate-500">
              Tell us about your business to get started with TrustBridge
            </p>
          </header>

          {/* Feedback Message - with ARIA live region for screen readers */}
          {message && (
            <div
              role="alert"
              aria-live="polite"
              className={`p-3 rounded-lg text-sm text-center ${
                message.type === "error"
                  ? "bg-red-50 text-red-600"
                  : "bg-green-50 text-green-600"
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Business Name */}
            <div className="space-y-1">
              <label
                htmlFor="businessName"
                className="text-sm font-medium text-slate-700"
              >
                Business Name{" "}
                <span className="text-red-500" aria-label="required">
                  *
                </span>
              </label>
              <div className="relative">
                <Building2
                  className="absolute left-3 top-3 h-5 w-5 text-slate-400"
                  aria-hidden="true"
                />
                <input
                  type="text"
                  id="businessName"
                  name="businessName"
                  required
                  aria-required="true"
                  aria-describedby="businessName-hint"
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="e.g., Chidi's Hardware & Supplies"
                  value={formData.businessName}
                  onChange={handleChange}
                />
              </div>
              <span id="businessName-hint" className="sr-only">
                Enter the legal or trading name of your business
              </span>
            </div>

            {/* Business Sector */}
            <div className="space-y-1">
              <label
                htmlFor="sector"
                className="text-sm font-medium text-slate-700"
              >
                Business Sector{" "}
                <span className="text-red-500" aria-label="required">
                  *
                </span>
              </label>
              <div className="relative">
                <Briefcase
                  className="absolute left-3 top-3 h-5 w-5 text-slate-400"
                  aria-hidden="true"
                />
                <select
                  id="sector"
                  name="sector"
                  required
                  aria-required="true"
                  aria-describedby="sector-hint"
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all appearance-none bg-white"
                  value={formData.sector}
                  onChange={handleChange}
                >
                  <option value="">Select your sector</option>
                  <option value="Construction">Construction</option>
                  <option value="Retail">Retail</option>
                  <option value="Services">Services</option>
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Agriculture">Agriculture</option>
                  <option value="Technology">Technology</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <span id="sector-hint" className="sr-only">
                Choose the industry category that best describes your business
              </span>
            </div>

            {/* Contact Number */}
            <div className="space-y-1">
              <label
                htmlFor="contact"
                className="text-sm font-medium text-slate-700"
              >
                Contact Number{" "}
                <span className="text-red-500" aria-label="required">
                  *
                </span>
              </label>
              <div className="relative">
                <Phone
                  className="absolute left-3 top-3 h-5 w-5 text-slate-400"
                  aria-hidden="true"
                />
                <input
                  type="tel"
                  id="contact"
                  name="contact"
                  required
                  aria-required="true"
                  aria-describedby="contact-hint"
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="+234 800 000 0000"
                  value={formData.contact}
                  onChange={handleChange}
                />
              </div>
              <span id="contact-hint" className="sr-only">
                Enter your business phone number with country code
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              aria-busy={loading}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-lg shadow-md transition-all flex items-center justify-center disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {loading ? (
                <>
                  <Loader2
                    className="w-5 h-5 animate-spin mr-2"
                    aria-hidden="true"
                  />
                  <span>Creating Profile...</span>
                </>
              ) : (
                "Create Profile"
              )}
            </button>
          </form>

          {/* Back Link */}
          <div className="pt-4 border-t border-slate-100 text-center">
            <button
              onClick={() => navigate("/")}
              className="inline-flex items-center text-sm text-slate-400 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-2 py-1"
              aria-label="Go back to home page"
            >
              <ArrowLeft className="w-4 h-4 mr-1" aria-hidden="true" />
              Back to Home
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
