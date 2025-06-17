"use client";
import { useState } from "react";

export default function FarmerPage() {
  const [formData, setFormData] = useState({
    Temparature: "",
    Humidity: "",
    Moisture: "",
    SoilType: "Sandy",
    CropType: "Wheat",
    Nitrogen: "",
    Phosphorous: "",
    Potassium: "",
  });

  const [result, setResult] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch("https://fertilizer-api-wduj.onrender.com/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Temparature: parseFloat(formData.Temparature),
          Humidity: parseFloat(formData.Humidity),
          Moisture: parseFloat(formData.Moisture),
          "Soil Type": formData.SoilType,
          "Crop Type": formData.CropType,
          Nitrogen: parseInt(formData.Nitrogen),
          Phosphorous: parseInt(formData.Phosphorous),
          Potassium: parseInt(formData.Potassium),
        }),
      });

      const data = await response.json();
      setResult(data.fertilizer || `Error: ${data.error}`);
    } catch (error) {
      setResult("Something went wrong.");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Fertilizer Recommendation</h2>

      {["Temparature", "Humidity", "Moisture", "Nitrogen", "Phosphorous", "Potassium"].map((field) => (
        <input
          key={field}
          type="number"
          name={field}
          value={(formData as any)[field]}
          onChange={handleChange}
          placeholder={field}
          className="w-full p-2 mb-3 border rounded"
        />
      ))}

      <select name="SoilType" value={formData.SoilType} onChange={handleChange} className="w-full p-2 mb-3 border rounded">
        <option>Sandy</option>
        <option>Loamy</option>
        <option>Black</option>
        <option>Red</option>
        <option>Clayey</option>
      </select>

      <select name="CropType" value={formData.CropType} onChange={handleChange} className="w-full p-2 mb-3 border rounded">
        <option>Wheat</option>
        <option>Barley</option>
        <option>Maize</option>
        <option>Rice</option>
        <option>Cotton</option>
        <option>Sugarcane</option>
        <option>Millets</option>
        <option>Oil seeds</option>
        <option>Pulses</option>
      </select>

      <button onClick={handleSubmit} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
        Predict Fertilizer
      </button>

      {result && (
        <div className="mt-4 p-3 bg-gray-100 border rounded">
          <strong>Recommended Fertilizer:</strong> {result}
        </div>
      )}
    </div>
  );
}
