"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, Loader2, Send } from "lucide-react";
import {
  diagnosticSchema,
  stepFields,
  type DiagnosticData,
} from "@/lib/forms/schema";
import {
  presupuestoLabels,
  tipoNecesidadLabels,
  urgenciaLabels,
} from "@/lib/forms/labels";
import { submitDiagnostic } from "@/lib/forms/submit";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { FormField } from "./FormField";

const stepTitles: Record<1 | 2 | 3, { title: string; subtitle: string }> = {
  1: {
    title: "Tus datos",
    subtitle: "Para poder responderte a la brevedad.",
  },
  2: {
    title: "Tu necesidad",
    subtitle: "Cuéntanos brevemente qué quieres resolver.",
  },
  3: {
    title: "Contexto",
    subtitle: "Esto nos ayuda a darte una propuesta más precisa.",
  },
};

const tipoOptions = Object.entries(tipoNecesidadLabels).map(([value, label]) => ({
  value,
  label,
}));
const urgenciaOptions = Object.entries(urgenciaLabels).map(([value, label]) => ({
  value,
  label,
}));
const presupuestoOptions = Object.entries(presupuestoLabels).map(([value, label]) => ({
  value,
  label,
}));

export function DiagnosticForm() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    trigger,
    formState: { errors },
  } = useForm<DiagnosticData>({
    resolver: zodResolver(diagnosticSchema),
    mode: "onTouched",
  });

  async function handleNext() {
    const valid = await trigger(stepFields[step]);
    if (valid && step < 3) setStep((step + 1) as 1 | 2 | 3);
  }

  function handlePrev() {
    if (step > 1) setStep((step - 1) as 1 | 2 | 3);
  }

  const onSubmit = handleSubmit(async (data) => {
    setSubmitting(true);
    setSubmitError(null);
    const result = await submitDiagnostic(data);
    if (result.ok) {
      router.push("/gracias");
    } else {
      setSubmitting(false);
      setSubmitError(result.error);
    }
  });

  const stepMeta = stepTitles[step];

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm sm:p-8">
      <ProgressBar current={step} total={3} className="mb-6" />

      <div className="mb-6">
        <h3 className="text-xl font-bold text-[var(--color-text-strong)]">
          {stepMeta.title}
        </h3>
        <p className="mt-1 text-sm text-[var(--color-text)]">
          {stepMeta.subtitle}
        </p>
      </div>

      <form onSubmit={onSubmit} noValidate className="space-y-4">
        {step === 1 && (
          <>
            <FormField
              id="nombre"
              label="Nombre"
              placeholder="Nombre y apellido"
              autoComplete="name"
              error={errors.nombre?.message}
              {...register("nombre")}
            />
            <FormField
              id="empresa"
              label="Empresa"
              placeholder="Nombre de tu empresa"
              autoComplete="organization"
              error={errors.empresa?.message}
              {...register("empresa")}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                id="whatsapp"
                label="WhatsApp"
                placeholder="+593 999 999 999"
                inputMode="tel"
                autoComplete="tel"
                error={errors.whatsapp?.message}
                {...register("whatsapp")}
              />
              <FormField
                id="correo"
                label="Correo"
                type="email"
                placeholder="tu@empresa.com"
                autoComplete="email"
                error={errors.correo?.message}
                {...register("correo")}
              />
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <FormField
              as="select"
              id="tipoNecesidad"
              label="Tipo de necesidad"
              options={tipoOptions}
              error={errors.tipoNecesidad?.message}
              {...register("tipoNecesidad")}
            />
            <FormField
              as="textarea"
              id="procesoActual"
              label="¿Cómo manejas actualmente ese proceso?"
              placeholder="Por ejemplo: lo llevamos en Excel y enviamos correos manualmente cada semana…"
              error={errors.procesoActual?.message}
              {...register("procesoActual")}
            />
            <FormField
              as="textarea"
              id="problema"
              label="Principal problema"
              placeholder="¿Qué es lo que te frena o te genera más fricción?"
              error={errors.problema?.message}
              {...register("problema")}
            />
          </>
        )}

        {step === 3 && (
          <>
            <Controller
              control={control}
              name="urgencia"
              render={({ field }) => (
                <FormField
                  as="radio"
                  id="urgencia"
                  label="Urgencia"
                  name={field.name}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  options={urgenciaOptions}
                  error={errors.urgencia?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="presupuesto"
              render={({ field }) => (
                <FormField
                  as="radio"
                  id="presupuesto"
                  label="Presupuesto aproximado"
                  name={field.name}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  options={presupuestoOptions}
                  error={errors.presupuesto?.message}
                />
              )}
            />
            <FormField
              as="textarea"
              id="mensaje"
              label="Mensaje adicional (opcional)"
              placeholder="Cualquier contexto extra que nos quieras dar."
              error={errors.mensaje?.message}
              {...register("mensaje")}
            />
          </>
        )}

        {submitError && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {submitError}
          </p>
        )}

        <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={handlePrev}
            disabled={step === 1 || submitting}
            className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold text-white/70 hover:text-white disabled:invisible"
          >
            <ArrowLeft className="h-4 w-4" />
            Anterior
          </button>

          {step < 3 ? (
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--color-accent)] px-6 py-3 text-sm font-semibold text-white hover:bg-[var(--color-accent-hover)]"
            >
              Siguiente
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--color-accent)] px-6 py-3 text-sm font-semibold text-white hover:bg-[var(--color-accent-hover)] disabled:opacity-70"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Enviando…
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Enviar diagnóstico
                </>
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
