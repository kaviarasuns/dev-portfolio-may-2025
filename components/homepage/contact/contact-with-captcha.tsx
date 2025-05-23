"use client";
// @flow strict
import { isValidEmail } from "@/utils/check-email";
import emailjs from "@emailjs/browser";
import axios from "axios";
import { useState, MouseEvent } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { TbMailForward } from "react-icons/tb";
import { toast } from "react-toastify";

interface FormInput {
  name: string;
  email: string;
  message: string;
  [key: string]: unknown; // Add index signature for EmailJS
}

interface FormError {
  email: boolean;
  required: boolean;
}

function ContactWithCaptcha() {
  const [input, setInput] = useState<FormInput>({
    name: "",
    email: "",
    message: "",
  });
  const [captcha, setCaptcha] = useState<string | null>(null);
  const [error, setError] = useState<FormError>({
    email: false,
    required: false,
  });

  const checkRequired = () => {
    if (input.email && input.message && input.name) {
      setError({ ...error, required: false });
    }
  };

  const handleSendMail = async (e: MouseEvent<HTMLButtonElement>) => {
    if (!captcha) {
      toast.error("Please complete the captcha!");
      return;
    }

    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
    if (!siteKey) {
      toast.error("Missing reCAPTCHA site key");
      return;
    }

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/google`,
        {
          token: captcha,
        }
      );

      setCaptcha(null);
      if (!res.data.success) {
        toast.error("Captcha verification failed!");
        return;
      }
    } catch (error) {
      toast.error(
        "Captcha verification failed: " +
          (error instanceof Error ? error.message : "Unknown error")
      );
      return;
    }

    e.preventDefault();
    if (!input.email || !input.message || !input.name) {
      setError({ ...error, required: true });
      return;
    } else if (error.email) {
      return;
    }

    const serviceID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
    const templateID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

    if (!serviceID || !templateID || !publicKey) {
      toast.error("Missing EmailJS configuration");
      return;
    }

    try {
      const res = await emailjs.send(serviceID, templateID, input, {
        publicKey,
      });

      if (res.status === 200) {
        toast.success("Message sent successfully!");
        setInput({
          name: "",
          email: "",
          message: "",
        });
      }
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : "Failed to send message"
      );
    }
  };

  return (
    <div className="">
      <p className="font-medium mb-5 text-[#16f2b3] text-xl uppercase">
        Contact with me
      </p>
      <div className="max-w-3xl text-white rounded-lg border border-[#464c6a] p-3 lg:p-5">
        <p className="text-sm text-[#d3d8e8]">
          {
            "If you have any questions or concerns, please don't hesitate to contact me. I am open to any work opportunities that align with my skills and interests."
          }
        </p>
        <div className="mt-6 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-base">Your Name: </label>
            <input
              className="bg-[#10172d] w-full border rounded-md border-[#353a52] focus:border-[#16f2b3] ring-0 outline-0 transition-all duration-300 px-3 py-2"
              type="text"
              maxLength={100}
              required={true}
              onChange={(e) => setInput({ ...input, name: e.target.value })}
              onBlur={checkRequired}
              value={input.name}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-base">Your Email: </label>
            <input
              className="bg-[#10172d] w-full border rounded-md border-[#353a52] focus:border-[#16f2b3] ring-0 outline-0 transition-all duration-300 px-3 py-2"
              type="email"
              maxLength={100}
              required={true}
              value={input.email}
              onChange={(e) => setInput({ ...input, email: e.target.value })}
              onBlur={() => {
                checkRequired();
                setError({ ...error, email: !isValidEmail(input.email) });
              }}
            />
            {error.email && (
              <p className="text-sm text-red-400">
                Please provide a valid email!
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-base">Your Message: </label>
            <textarea
              className="bg-[#10172d] w-full border rounded-md border-[#353a52] focus:border-[#16f2b3] ring-0 outline-0 transition-all duration-300 px-3 py-2"
              maxLength={500}
              name="message"
              required={true}
              onChange={(e) => setInput({ ...input, message: e.target.value })}
              onBlur={checkRequired}
              rows={4}
              value={input.message}
            />
          </div>
          {process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && (
            <ReCAPTCHA
              sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
              onChange={setCaptcha}
            />
          )}
          <div className="flex flex-col items-center gap-2">
            {error.required && (
              <p className="text-sm text-red-400">
                Email and Message are required!
              </p>
            )}
            <button
              className="flex items-center gap-1 hover:gap-3 rounded-full bg-gradient-to-r from-pink-500 to-violet-600 px-5 md:px-12 py-2.5 md:py-3 text-center text-xs md:text-sm font-medium uppercase tracking-wider text-white no-underline transition-all duration-200 ease-out hover:text-white hover:no-underline md:font-semibold"
              role="button"
              onClick={handleSendMail}
            >
              <span>Send Message</span>
              <TbMailForward className="mt-1" size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactWithCaptcha;
