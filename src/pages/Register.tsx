import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FiUserPlus } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import Loading from "@/pages/Loading";

export default function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const validateEmail = (value: string) => {
    return /\S+@\S+\.\S+/.test(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // On success, navigate to login or dashboard
      navigate("/login");
    }, 1200);
  };

  const handleGoogle = () => {
    setError(null);
    setIsGoogleLoading(true);
    // Simulate OAuth flow
    setTimeout(() => {
      setIsGoogleLoading(false);
      navigate("/dashboard");
    }, 1200);
  };

  const inputMotion = {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[var(--color-background)]">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.45 }}
        className="glass-card max-w-lg w-full p-8 md:p-10"
      >
        <div className="mb-6 text-center">
          <h1 className="section-title text-3xl md:text-4xl mb-2">
            Create account
          </h1>
          <p className="text-on-surface opacity-75">
            Join DailyHelper — simplify your student life.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <motion.div {...inputMotion} transition={{ delay: 0.05 }}>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@school.edu"
              className="input-field mt-2"
              required
            />
          </motion.div>

          <motion.div {...inputMotion} transition={{ delay: 0.1 }}>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a secure password"
              className="input-field mt-2"
              required
            />
            <p className="text-sm text-on-surface opacity-60 mt-2">
              Minimum 8 characters
            </p>
          </motion.div>

          <motion.div {...inputMotion} transition={{ delay: 0.15 }}>
            <Label htmlFor="confirm">Confirm password</Label>
            <Input
              id="confirm"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repeat your password"
              className="input-field mt-2"
              required
            />
          </motion.div>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-error text-sm font-medium text-center"
              role="alert"
            >
              {error}
            </motion.p>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Button
              type="submit"
              className="btn-primary w-full flex items-center justify-center gap-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loading />
              ) : (
                <>
                  <FiUserPlus /> Sign Up
                </>
              )}
            </Button>
          </motion.div>
        </form>

        <div className="my-4 flex items-center gap-4">
          <hr className="flex-1 border-accent/30" />
          <span className="text-on-surface opacity-60 text-sm">or</span>
          <hr className="flex-1 border-accent/30" />
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.28 }}
        >
          <Button
            variant="outline"
            className="w-full justify-center gap-2"
            onClick={handleGoogle}
            disabled={isGoogleLoading}
          >
            {isGoogleLoading ? (
              <Loading />
            ) : (
              <>
                <FcGoogle className="text-lg" /> Sign Up with Google
              </>
            )}
          </Button>
        </motion.div>

        <div className="mt-6 text-center">
          <p className="text-on-surface opacity-75">
            Already have an account?{" "}
            <Link to="/login" className="text-gradient font-semibold">
              Log in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
