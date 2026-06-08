import type { Metadata } from "next";
import { WhyBentoSampleSplit } from "@/components/blocks/WhyBentoSampleSplit";

export const metadata: Metadata = {
  title: "Preview · Why Bento (Split Mixto)",
  robots: { index: false, follow: false },
};

export default function WhyBentoSplitPreviewPage() {
  return <WhyBentoSampleSplit />;
}
