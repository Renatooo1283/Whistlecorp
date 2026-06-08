import type { Metadata } from "next";
import { WhyBentoSampleLight } from "@/components/blocks/WhyBentoSampleLight";

export const metadata: Metadata = {
  title: "Preview · Why Bento (Light)",
  robots: { index: false, follow: false },
};

export default function WhyBentoLightPreviewPage() {
  return <WhyBentoSampleLight />;
}
