// src/Citizen/CertificateForm.jsx
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, FileText, Clock3 } from "lucide-react";
import CitizenLayout from "../Layouts/CitizenLayouts";
import { findCertificate } from "../services/certificateData";
import BirthCertFlow from "./BirthCertFlow";
import MarriageCertFlow from "./MarriageCertFlow";
import DeathCertFlow from "./DeathCertFlow";
import CedulaFlow from "./CedulaFlow";
import TaxPaymentCertFlow from "./TaxPaymentCertFlow";
import TaxClearanceFlow from "./TaxClearanceFlow";
import PWDRegistrationFlow from "./PWDRegistrationFlow";
import PWDIDFlow from "./PWDIDFlow";
import DisabilityCertFlow from "./DisabilityCertFlow";
import SoloParentIDFlow from "./SoloParentIDFlow";
import SoloParenthoodCertFlow from "./SoloParenthoodCertFlow";
import SoloParentRegistrationCertFlow from "./SoloParentRegistrationCertFlow";

export default function CertificateForm() {
  const { officeId, certId } = useParams();
  const result = findCertificate(officeId, certId);

  useEffect(() => {
    document.title = `Request ${result?.cert?.name ?? "Certificate"} — ACORS`;
  }, [result]);

  const isLCROBirthCert = officeId === "lcr" && certId === "birth-cert";
  const isLCROMarriageCert = officeId === "lcr" && certId === "marriage-cert";
  const isLCRODeathCert = officeId === "lcr" && certId === "death-cert";

  const isCTOCedula = officeId === "treasurer" && certId === "cedula";
  const isCTOTaxPayment = officeId === "treasurer" && certId === "tax-payment";
  const isCTOTaxClearance = officeId === "treasurer" && certId === "tax-clearance";

  const isPDAORegistration = officeId === "pdao" && certId === "pwd-registration";
  const isPDAOId = officeId === "pdao" && certId === "pwd-id";
  const isPDAODisabilityCert = officeId === "pdao" && certId === "disability-cert";

  const isSoloParentId = officeId === "soloparent" && certId === "solo-parent-id";
  const isSoloParenthood = officeId === "soloparent" && certId === "solo-parenthood";
  const isSoloRegistration = officeId === "soloparent" && certId === "solo-registration";

  return (
    <CitizenLayout hideHeader>
      {isLCROBirthCert ? (
        <BirthCertFlow office={result?.office} cert={result?.cert} />
      ) : isLCROMarriageCert ? (
        <MarriageCertFlow office={result?.office} cert={result?.cert} />
      ) : isLCRODeathCert ? (
        <DeathCertFlow office={result?.office} cert={result?.cert} />
      ) : isCTOCedula ? (
        <CedulaFlow office={result?.office} cert={result?.cert} />
      ) : isCTOTaxPayment ? (
        <TaxPaymentCertFlow office={result?.office} cert={result?.cert} />
      ) : isCTOTaxClearance ? (
        <TaxClearanceFlow office={result?.office} cert={result?.cert} />
      ) : isPDAORegistration ? (
        <PWDRegistrationFlow office={result?.office} cert={result?.cert} />
      ) : isPDAOId ? (
        <PWDIDFlow office={result?.office} cert={result?.cert} />
      ) : isPDAODisabilityCert ? (
        <DisabilityCertFlow office={result?.office} cert={result?.cert} />
      ) : isSoloParentId ? (
        <SoloParentIDFlow office={result?.office} cert={result?.cert} />
      ) : isSoloParenthood ? (
        <SoloParenthoodCertFlow office={result?.office} cert={result?.cert} />
      ) : isSoloRegistration ? (
        <SoloParentRegistrationCertFlow office={result?.office} cert={result?.cert} />
      ) : (
        <div className="mx-auto max-w-2xl px-5 pb-24 pt-10 lg:px-0">
          <Link
            to="/request-certificate"
            className="inline-flex items-center gap-2 rounded-xl px-2 py-1.5 text-sm font-bold text-gray-500 transition hover:bg-zinc-100 hover:text-gray-800"
          >
            <ArrowLeft size={16} />
            Back to certificates
          </Link>

          {!result ? (
            <div className="mt-8 rounded-3xl border border-zinc-200 bg-white p-8 text-center shadow-sm">
              <p className="text-sm font-bold text-gray-800">
                Certificate not found
              </p>
              <p className="mt-1 text-sm text-gray-500">
                The certificate you are looking for does not exist.
              </p>
            </div>
          ) : (
            <>
              <section className="mt-4 animate-fade-up">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-red-600 text-white shadow-sm">
                    <result.office.icon size={20} />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-xs font-bold uppercase tracking-[0.14em] text-gray-400">
                      {result.office.name}
                    </p>
                    <h1 className="text-xl font-extrabold leading-snug text-gray-900 sm:text-2xl">
                      {result.cert.name}
                    </h1>
                  </div>
                </div>
              </section>

              <section className="mt-6 animate-fade-up rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 text-gray-500">
                    <FileText size={18} />
                  </span>
                  <div>
                    <h2 className="text-sm font-extrabold text-gray-900">
                      Application form
                    </h2>
                    <p className="text-xs text-gray-500">
                      Fill up your details to complete the request.
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex flex-col items-center rounded-2xl border border-dashed border-zinc-300 px-6 py-12 text-center">
                  <Clock3 size={26} className="text-zinc-300" />
                  <p className="mt-4 text-sm font-bold text-gray-700">
                    Form fields coming next
                  </p>
                  <p className="mt-1 max-w-xs text-xs leading-5 text-gray-500">
                    The application form for this certificate will be added here.
                  </p>
                </div>
              </section>
            </>
          )}
        </div>
      )}
    </CitizenLayout>
  );
}