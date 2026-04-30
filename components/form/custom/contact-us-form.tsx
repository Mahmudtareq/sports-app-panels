"use client";
import { SubmitHandler, useForm } from "react-hook-form";

interface FormData {
  name: string;
  email: string;
  phone: string;
  note: string;
}

const ContactUsForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      note: "",
    },
  });

  const onSubmit: SubmitHandler<FormData> = (data) => {
    reset();
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="lg:border dark:border-primary p-6 md:p-8 lg:border-[#FFBFA8] shadow-xl"
    >
      <p className="text-sm text-gray-700 dark:text-gray-300 mb-6">
        Get in touch to discuss your project or request a quote. We're here to
        help every step of the way.
      </p>

      <div className="space-y-6">
        {/* Name */}
        <div>
          <label className="block p-text-18 font-medium text-[#141414] dark:text-white mb-3">
            Name
          </label>
          <input
            type="text"
            placeholder="Write your name here"
            {...register("name", { required: "Name is required" })}
            className="w-full px-4 py-3 border caret-primary border-gray-300 dark:border-gray-400 rounded-lg  text-black dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-primary focus:placeholder:text-primary"
          />
          {errors.name && (
            <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block p-text-18 font-medium text-[#141414] dark:text-white mb-3">
            Email
          </label>
          <input
            type="email"
            placeholder="Write your email address here"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Enter a valid email address",
              },
            })}
            className="w-full px-4 py-3 border caret-primary border-gray-300 dark:border-gray-400 rounded-lg  text-black dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-primary focus:placeholder:text-primary"
          />
          {errors.email && (
            <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block p-text-18 font-medium text-[#141414] dark:text-white mb-3">
            Phone Number
          </label>
          <input
            type="tel"
            placeholder="Write your Phone Number here"
            {...register("phone", {
              required: "Phone number is required",
              pattern: {
                value: /^[0-9+\-\s()]*$/,
                message: "Enter a valid phone number",
              },
            })}
            className="w-full px-4 py-3 border caret-primary border-gray-300 dark:border-gray-400 rounded-lg  text-black dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-primary focus:placeholder:text-primary"
          />
          {errors.phone && (
            <p className="text-sm text-red-500 mt-1">{errors.phone.message}</p>
          )}
        </div>

        {/* Note */}
        <div>
          <label className="block p-text-18 font-medium text-[#141414] dark:text-white mb-3">
            Note
          </label>
          <textarea
            rows={4}
            placeholder="Write if you have any note for us"
            {...register("note")}
            className="w-full px-4 py-3 border caret-primary border-gray-300 dark:border-gray-400 rounded-lg  text-black dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-primary focus:placeholder:text-primary"
          />
        </div>

        <button
          type="submit"
          className="w-full md:w-auto px-8 py-3 bg-primary text-white font-semibold rounded-full hover:bg-primary/90 transition-all hover:shadow-lg uppercase text-sm"
        >
          SEND MESSAGE
        </button>
      </div>
    </form>
  );
};

export default ContactUsForm;
