import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

export default function App() {
  const [cvFile, setCvFile] = useState(null);
  const [jdText, setJdText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!cvFile || !jdText) return;

    const formData = new FormData();
    formData.append("cv", cvFile);
    formData.append("jd", jdText);

    setLoading(true);

    try {
      const res = await axios.post("http://localhost:8000/analyze", formData);
      setResult(res.data);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-bold mb-6">
        💀 AI CV Rejection Simulator
      </h1>

      {/* INPUT */}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <p className="mb-2">Upload CV</p>
          <input
            type="file"
            onChange={(e) => setCvFile(e.target.files[0])}
            className="bg-gray-800 p-2 rounded"
          />
        </div>

        <div>
          <p className="mb-2">Paste Job Description</p>
          <textarea
            className="w-full h-32 bg-gray-800 p-2 rounded"
            onChange={(e) => setJdText(e.target.value)}
          />
        </div>
      </div>

      <button
        onClick={handleAnalyze}
        className="mt-6 px-6 py-2 bg-red-600 rounded hover:bg-red-700"
      >
        Analyze My CV
      </button>

      {/* LOADING */}
      {loading && (
        <motion.div
          className="mt-10 text-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Analyzing your CV...
        </motion.div>
      )}

      {/* RESULT */}
      {result && (
        <motion.div
          className="mt-10"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Journey */}
          <div className="mb-6">
            <p className="text-lg mb-2">Application Journey</p>
            <div className="flex gap-4">
              {["Parsing", "Matching", "Ranking", "Human Review"].map(
                (step, i) => (
                  <motion.div
                    key={i}
                    className={`px-4 py-2 rounded ${
                      i < result.stageIndex
                        ? "bg-green-600"
                        : "bg-red-600"
                    }`}
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                  >
                    {step}
                  </motion.div>
                )
              )}
            </div>
          </div>

          {/* Verdict */}
          <motion.div
            className="text-2xl font-bold mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {result.verdict}
          </motion.div>

          {/* Score */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-800 p-4 rounded">
              Match Score: {result.score}%
            </div>
            <div className="bg-gray-800 p-4 rounded">
              Rank: #{result.rank} / {result.total}
            </div>
          </div>

          {/* Feedback */}
          <div className="bg-gray-900 p-4 rounded">
            <p className="mb-2 font-semibold">AI Feedback</p>
            <p>{result.feedback}</p>
          </div>

          {/* Brutal Truth */}
          <motion.div
            className="mt-6 text-red-400 text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {result.brutal}
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}