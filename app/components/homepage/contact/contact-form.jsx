"use client";
// @flow strict
import { isValidEmail } from "@/utils/check-email";
import axios from "axios";
import { useState } from "react";
import { TbMailForward } from "react-icons/tb";
import { toast } from "react-toastify";

function ContactForm() {
  // State
  const [userInput, setUserInput] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [error, setError] = useState({ email: false, required: false });
  const [isLoading, setIsLoading] = useState(false);

  // Helpers
  const checkRequired = () => {
    if (userInput.email && userInput.message && userInput.name) {
      setError((prev) => ({ ...prev, required: false }));
    }
  };

  // Event Handlers
  const handleSendMail = async (e) => {
    e.preventDefault();

    if (!userInput.email || !userInput.message || !userInput.name) {
      setError((prev) => ({ ...prev, required: true }));
      return;
    } else if (error.email) {
      return;
    } else {
      setError((prev) => ({ ...prev, required: false }));
    }

    try {
      setIsLoading(true);
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/contact`,
        userInput
      );

      toast.success("Message sent successfully!");
      setUserInput({
        name: "",
        email: "",
        message: "",
      });
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      setIsLoading(false);
    }
  };

  // No UI
  return (
    <form
      className="bg-[#1a1443] p-6 rounded-lg flex flex-col gap-5 shadow-lg"
      onSubmit={handleSendMail}
    >
      <h2 className="text-2xl font-bold mb-2 text-white">Contact Me</h2>
      <input
        type="text"
        placeholder="Full Name"
        className="p-3 rounded bg-[#23235b] text-white focus:outline-none focus:ring-2 focus:ring-[#16f2b3]"
        value={userInput.name}
        onChange={e => {
          setUserInput({ ...userInput, name: e.target.value });
          checkRequired();
        }}
        disabled={isLoading}
      />
      <input
        type="email"
        placeholder="Email"
        className={`p-3 rounded bg-[#23235b] text-white focus:outline-none focus:ring-2 focus:ring-[#16f2b3] ${error.email ? 'border border-red-500' : ''}`}
        value={userInput.email}
        onChange={e => {
          setUserInput({ ...userInput, email: e.target.value });
          setError((prev) => ({ ...prev, email: !isValidEmail(e.target.value) }));
          checkRequired();
        }}
        disabled={isLoading}
      />
      <textarea
        placeholder="Message"
        className="p-3 rounded bg-[#23235b] text-white focus:outline-none focus:ring-2 focus:ring-[#16f2b3] min-h-[100px]"
        value={userInput.message}
        onChange={e => {
          setUserInput({ ...userInput, message: e.target.value });
          checkRequired();
        }}
        disabled={isLoading}
      />
      {error.required && (
        <p className="text-red-400 text-sm">Please fill in all fields.</p>
      )}
      {error.email && (
        <p className="text-red-400 text-sm">Invalid email.</p>
      )}
      <button
        type="submit"
        className="flex items-center justify-center gap-2 bg-[#16f2b3] text-[#1a1443] font-bold py-3 rounded hover:bg-[#13cfa0] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
        disabled={isLoading}
      >
        {isLoading ? (
          <span>Sending...</span>
        ) : (
          <>
            <TbMailForward size={22} />
            Send Message
          </>
        )}
      </button>
    </form>
  );
}

export default ContactForm;