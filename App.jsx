// App.jsx
import React, { useState } from "react";
import { Button } from "@/components/ui/button";

export default function App() {
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    phone: "",
    email: "",
    summary: "",
    skills: "",
    experience: "",
    education: "",
    languages: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:5000/generate-pdf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const blob = await res.blob();
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "resume.pdf";
    link.click();
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-semibold text-center mb-6">ATS-Friendly Resume Builder</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {Object.entries(formData).map(([field, value]) => (
          <div key={field}>
            <label className="block text-sm font-medium text-gray-700 capitalize">{field}</label>
            <textarea
              name={field}
              value={value}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200"
              rows={["summary", "experience", "education", "skills", "languages"].includes(field) ? 4 : 2}
            />
          </div>
        ))}
        <div className="text-center">
          <Button type="submit" className="px-6 py-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg">Generate PDF</Button>
        </div>
      </form>
    </div>
  );
}