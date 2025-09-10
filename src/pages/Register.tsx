import { useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { Card, CardContent, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { FiUserPlus } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const buttonControls = useAnimation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setError("");
    setIsLoading(true);
    await buttonControls.start({
      scale: [1, 1.1, 1],
      transition: { duration: 0.3 },
    });
    try {
      // Placeholder API call
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) throw new Error("Registration failed");
      // Redirect or show success message
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    setIsLoading(true);
    try {
      // Placeholder Google registration logic (e.g., Firebase, Supabase, or OAuth)
      console.log("Initiating Google registration...");
      // Redirect or update auth state on success
    } catch (err) {
      setError(err.message || "Google registration failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const inputVariants = {
    focus: {
      scale: 1.02,
      boxShadow: "0 0 10px rgba(37, 99, 235, 0.5)",
      transition: { duration: 0.2 },
    },
    blur: {
      scale: 1,
      boxShadow: "none",
      transition: { duration: 0.2 },
    },
  };

  const errorVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden font-sans">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10"
      >
        <Card className="w-full max-w-md bg-transparent border-none shadow-glass backdrop-blur-xl rounded-xl overflow-hidden">
          <div className="absolute inset-0 pointer-events-none rounded-xl border-2 border-blue-600/40 animate-pulse shadow-[0_0_50px_15px_rgba(37,99,235,0.3)]"></div>
          <motion.form
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            onSubmit={handleSubmit}
            className="relative z-10"
          >
            <CardContent className="p-10">
              <CardTitle className="text-4xl font-extrabold mb-10 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500 text-center drop-shadow-[0_2px_10px_rgba(37,99,235,0.6)] animate-gradient-x">
                Create Account
              </CardTitle>
              <div className="mb-6 relative">
                <motion.label
                  className="block text-blue-300 mb-2 font-semibold tracking-wide transition-all duration-300"
                  htmlFor="email"
                  animate={email ? { y: -25, scale: 0.9 } : { y: 0, scale: 1 }}
                >
                  Email
                </motion.label>
                <motion.input
                  id="email"
                  type="email"
                  aria-label="Email address"
                  aria-describedby={error ? "form-error" : undefined}
                  className="w-full px-4 py-3 rounded-xl bg-gray-800/30 text-white focus:outline-none border border-blue-600/40 shadow-inner transition-all duration-300 placeholder-gray-400/50"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  variants={inputVariants}
                  whileFocus="focus"
                  initial="blur"
                  placeholder="Enter your email"
                />
              </div>
              <div className="mb-6 relative">
                <motion.label
                  className="block text-blue-300 mb-2 font-semibold tracking-wide transition-all duration-300"
                  htmlFor="password"
                  animate={
                    password ? { y: -25, scale: 0.9 } : { y: 0, scale: 1 }
                  }
                >
                  Password
                </motion.label>
                <motion.input
                  id="password"
                  type="password"
                  aria-label="Password"
                  aria-describedby={error ? "form-error" : undefined}
                  className="w-full px-4 py-3 rounded-xl bg-gray-800/30 text-white focus:outline-none border border-emerald-500/40 shadow-inner transition-all duration-300 placeholder-gray-400/50"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  variants={inputVariants}
                  whileFocus="focus"
                  initial="blur"
                  placeholder="Enter your password"
                />
              </div>
              <div className="mb-6 relative">
                <motion.label
                  className="block text-blue-300 mb-2 font-semibold tracking-wide transition-all duration-300"
                  htmlFor="confirmPassword"
                  animate={
                    confirmPassword
                      ? { y: -25, scale: 0.9 }
                      : { y: 0, scale: 1 }
                  }
                >
                  Confirm Password
                </motion.label>
                <motion.input
                  id="confirmPassword"
                  type="password"
                  aria-label="Confirm password"
                  aria-describedby={error ? "form-error" : undefined}
                  className="w-full px-4 py-3 rounded-xl bg-gray-800/30 text-white focus:outline-none border border-blue-600/40 shadow-inner transition-all duration-300 placeholder-gray-400/50"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                  variants={inputVariants}
                  whileFocus="focus"
                  initial="blur"
                  placeholder="Confirm your password"
                />
              </div>
              {error && (
                <motion.p
                  id="form-error"
                  aria-live="assertive"
                  className="text-red-400 mb-6 text-center font-medium drop-shadow animate-pulse"
                  variants={errorVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {error}
                </motion.p>
              )}
              <motion.div animate={buttonControls}>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-bold py-3 rounded-xl shadow-soft hover:scale-105 transition-all duration-300 relative overflow-hidden group ${
                    isLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isLoading ? (
                    "Signing Up..."
                  ) : (
                    <span className="relative z-10 flex items-center justify-center gap-2 drop-shadow-[0_2px_10px_rgba(37,99,235,0.6)]">
                      <FiUserPlus className="w-5 h-5" />
                      Sign Up
                    </span>
                  )}
                  <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all duration-500 rounded-full"></span>
                </Button>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
                className="mt-4"
              >
                <Button
                  type="button"
                  disabled={isLoading}
                  onClick={handleGoogleRegister}
                  className={`w-full bg-white/10 text-white font-bold py-3 rounded-xl shadow-soft hover:scale-105 transition-all duration-300 relative overflow-hidden group ${
                    isLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isLoading ? (
                    "Connecting..."
                  ) : (
                    <span className="relative z-10 flex items-center justify-center gap-2 drop-shadow-[0_2px_10px_rgba(37,99,235,0.6)]">
                      <FcGoogle className="w-5 h-5" />
                      Sign Up with Google
                    </span>
                  )}
                  <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all duration-500 rounded-full"></span>
                </Button>
              </motion.div>
              <p className="mt-8 text-blue-300 text-center text-sm">
                Already have an account?{" "}
                <a
                  href="/login"
                  className="text-emerald-400 hover:underline font-bold transition-colors duration-200"
                >
                  Login
                </a>
              </p>
            </CardContent>
          </motion.form>
        </Card>
      </motion.div>
    </div>
  );
};

export default Register;
