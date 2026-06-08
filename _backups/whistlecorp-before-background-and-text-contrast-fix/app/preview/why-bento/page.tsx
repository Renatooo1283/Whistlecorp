import type { Metadata } from "next";
import { WhyBentoSample } from "@/components/blocks/WhyBentoSample";

export const metadata: Metadata = {
  title: "Preview · Why Bento",
  robots: { index: false, follow: false },
};

export default function WhyBentoPreviewPage() {
  return <WhyBentoSample />;
}
