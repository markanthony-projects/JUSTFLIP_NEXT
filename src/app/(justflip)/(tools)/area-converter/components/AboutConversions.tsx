"use client";

import React from "react";
import { MdMap } from "react-icons/md";
import { IoMdBook, IoMdGlobe } from "react-icons/io";
import { GiIndiaGate } from "react-icons/gi";



function AboutConversions() {

  return (
    <main className="min-h-screen bg-slate-50 text-primary ">
      <div className="max-w-5xl space-y-12">
        
        <article className="prose prose-slate max-w-none bg-white px-6 sm:px-10 rounded-2x space-y-8 py-4">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
              <IoMdBook className="w-10 sm:w-6 h-12 sm:h-6 text-primary" /> About Measurement Units
            </h2>
            <p className="text-primary/200 leading-relaxed">
              Across India, measuring land involves a mix of global standards and deeply rooted regional units. While modern real estate relies on internationally accepted units like <strong>Square Feet</strong> and <strong>Hectares</strong>, local transactions in states like Uttar Pradesh, Tamil Nadu, West Bengal, and Maharashtra often use traditional terms like <strong>Bigha, Ground, Cent, and Guntha</strong>.
            </p>
          </section>

          {/* Regional Categorization Grid */}
          <section className="space-y-4">
            <h3 className="text-xl font-bold text-primary flex items-center gap-2">
              <GiIndiaGate className="w-5 h-5 text-primary" /> Regional Units Across India
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 not-prose">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <h4 className="font-bold text-primary text-base">1. North India</h4>
                <p className="text-xs text-primary/200 font-semibold">UP, Punjab, Haryana, Uttarakhand, Delhi</p>
                <p className="text-sm text-primary/70"><strong>Key Units:</strong> Bigha, Biswa, Biswansi, Killa, Ghumaon, Kanal, Marla</p>
              </div>
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <h4 className="font-bold text-primary text-base">2. South India</h4>
                <p className="text-xs text-primary/200 font-semibold">TN, AP, Telangana, Kerala, Karnataka</p>
                <p className="text-sm text-primary/70"><strong>Key Units:</strong> Cent, Ground, Ankanam, Guntha, Kuncham</p>
              </div>
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <h4 className="font-bold text-primary text-base">3. East & Northeast</h4>
                <p className="text-xs text-primary/200 font-semibold">West Bengal, Assam, Bihar, Jharkhand</p>
                <p className="text-sm text-primary/70"><strong>Key Units:</strong> Chatak, Decimal, Dhur, Kattha, Lecha, Bigha</p>
              </div>
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <h4 className="font-bold text-primary text-base">4. West India</h4>
                <p className="text-xs text-primary/200 font-semibold">Rajasthan, Gujarat, Maharashtra</p>
                <p className="text-sm text-primary/70"><strong>Key Units:</strong> Bigha, Biswa, Biswansi, Guntha</p>
              </div>
            </div>
          </section>

          {/* Popular Units Section */}
          <section className="space-y-4">
            <h3 className="text-xl font-bold text-primary flex items-center gap-2">
              <IoMdGlobe className="w-5 h-5 text-primary" /> Popular Conversion Units Explained
            </h3>
            <ul className="space-y-3 text-primary list-disc pl-5">
              <li className="text-primary/70" ><strong className="text-primary">Square Feet (sq ft):</strong> Standard measurement unit for residential apartments, builder floors, and plots in urban India.</li>
              <li className="text-primary/70" ><strong className="text-primary">Square Meter (sq m):</strong> Official SI unit of area used globally and in official municipal land registration documents.</li>
              <li className="text-primary/70" ><strong className="text-primary">Hectare (ha):</strong> Metric unit used for measuring large agricultural parcels. Equal to 10,000 sq m or ~2.47 acres.</li>
              <li className="text-primary/70" ><strong className="text-primary">Acre:</strong> Imperial unit widely used worldwide for rural land. Equal to 43,560 sq ft.</li>
              <li className="text-primary/70" ><strong className="text-primary">Bigha:</strong> Traditional land unit across Northern and Eastern India. Note that 1 Bigha varies by state (e.g., Pucca Bigha in Rajasthan is ~27,225 sq ft, while in West Bengal it is ~14,400 sq ft).</li>
            </ul>
          </section>

          {/* Table Component */}
          <section className="space-y-4">
            <h3 className="text-xl font-bold text-primary">Standard Unit Reference Table</h3>
            <div className="overflow-x-auto not-prose border border-slate-200 rounded-xl">
              <table className="w-full text-left text-sm text-slate-700">
                <thead className="bg-slate-100 text-primary font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3">From Unit</th>
                    <th className="p-3">Standard Equivalent</th>
                    <th className="p-3">Square Feet (sq ft)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="p-3 font-semibold">1 Acre</td>
                    <td className="p-3">0.4046 Hectares</td>
                    <td className="p-3">43,560 sq ft</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold">1 Hectare</td>
                    <td className="p-3">2.471 Acres</td>
                    <td className="p-3">107,639 sq ft</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold">1 Ground (TN)</td>
                    <td className="p-3">203.87 Sq Meters</td>
                    <td className="p-3">2,400 sq ft</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold">1 Guntha (MH/KA)</td>
                    <td className="p-3">101.17 Sq Meters</td>
                    <td className="p-3">1,089 sq ft</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold">1 Cent</td>
                    <td className="p-3">0.01 Acre</td>
                    <td className="p-3">435.6 sq ft</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </article>
      </div>
    </main>
  );
}


export default AboutConversions