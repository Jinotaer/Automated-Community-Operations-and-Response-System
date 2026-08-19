// src/Citizen/RequestCertificate.jsx
import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  ArrowRight,
} from "lucide-react";
import CitizenLayout from "../Layouts/CitizenLayouts";
import { certificateOffices } from "../services/certificateData";

export default function RequestCertificate() {
  useEffect(() => {
    document.title = "Request Certificate — ACORS Citizen Portal";
  }, []);

  return (
    <CitizenLayout>
      <div className="lg:hidden">
        <section className="px-5 pt-5">
          <h1 className="text-2xl font-extrabold text-gray-900">
            Request Certificate
          </h1>
          <p className="mt-1 text-sm leading-6 text-gray-500">
            Pick the certificate you need from the issuing department to start
            your application.
          </p>
        </section>

        <section className="space-y-8 px-5 pb-24 pt-4">
          {certificateOffices.map((office, index) => (
            <DepartmentSection
              key={office.id}
              office={office}
              index={index}
              gridClass="grid-cols-1"
            />
          ))}
        </section>
      </div>

      <div className="hidden lg:block">
        <section className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Request Certificate
          </h1>
          <p className="mt-2 text-sm leading-6 text-gray-500">
            Pick the certificate you need from the issuing department to start
            your application.
          </p>
        </section>

        <div className="space-y-10">
          {certificateOffices.map((office, index) => (
            <DepartmentSection
              key={office.id}
              office={office}
              index={index}
              gridClass="grid-cols-1 md:grid-cols-3"
            />
          ))}
        </div>
      </div>
    </CitizenLayout>
  );
}

function DepartmentSection({ office, index, gridClass }) {
  const Icon = office.icon;

  return (
    <section
      className="animate-fade-up"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-red-600 text-white shadow-sm">
          <Icon size={18} />
        </span>
        <div className="min-w-0">
          <h2 className="text-base font-extrabold leading-snug text-gray-900">
            {office.name}
          </h2>
          <p className="text-xs font-medium text-gray-500">
            {office.certificates.length} available certificates
          </p>
        </div>
      </div>

      <div className={`mt-3 grid gap-3 ${gridClass}`}>
        {office.certificates.map((cert) => (
          <Link
            key={cert.id}
            to={`/request-certificate/${office.id}/${cert.id}`}
            className="group flex items-center gap-3 rounded-2xl border border-zinc-200 bg-white p-3.5 text-left shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-red-200 hover:shadow-md"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-gray-400 transition group-hover:bg-red-50 group-hover:text-red-600">
              <FileText size={16} />
            </span>

            <span className="min-w-0 flex-1">
              <span className="block text-sm font-bold leading-snug text-gray-800">
                {cert.name}
              </span>
              <span className="mt-0.5 block text-[11px] font-medium text-gray-400">
                Start application
              </span>
            </span>

            <ArrowRight
              size={16}
              className="shrink-0 text-zinc-300 transition group-hover:translate-x-0.5 group-hover:text-red-600"
            />
          </Link>
        ))}
      </div>
    </section>
  );
}