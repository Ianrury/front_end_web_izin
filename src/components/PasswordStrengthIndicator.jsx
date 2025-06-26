import React from "react";
import { Check, X } from "lucide-react";

const PasswordStrengthIndicator = ({ strength, display }) => (
  <div className="space-y-3">
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-gray-700">Kekuatan Password</span>
      <span className={`text-xs font-medium px-2 py-1 rounded-full ${display.bg} ${display.color}`}>{display.text}</span>
    </div>
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((level) => (
        <div
          key={level}
          className={`h-2 flex-1 rounded-full transition-colors ${
            strength.score >= level ? (strength.score <= 2 ? "bg-red-400" : strength.score === 3 ? "bg-yellow-400" : strength.score === 4 ? "bg-blue-400" : "bg-green-400") : "bg-gray-200"
          }`}
        />
      ))}
    </div>
    <div className="grid grid-cols-1 gap-2">
      {[
        { key: "length", text: "Minimal 8 karakter" },
        { key: "uppercase", text: "Huruf besar (A-Z)" },
        { key: "lowercase", text: "Huruf kecil (a-z)" },
        { key: "number", text: "Angka (0-9)" },
        { key: "special", text: "Karakter khusus (!@#$%)" },
      ].map(({ key, text }) => (
        <div key={key} className="flex items-center space-x-2">
          {strength.checks[key] ? <Check className="w-4 h-4 text-green-500" /> : <X className="w-4 h-4 text-gray-400" />}
          <span className={`text-xs ${strength.checks[key] ? "text-green-600" : "text-gray-500"}`}>{text}</span>
        </div>
      ))}
    </div>
  </div>
);

export default React.memo(PasswordStrengthIndicator);
