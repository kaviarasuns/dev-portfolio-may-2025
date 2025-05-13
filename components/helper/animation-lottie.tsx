"use client";

import dynamic from "next/dynamic";
import type { LottieComponentProps } from "lottie-react";

// Dynamically import Lottie with SSR disabled
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

interface AnimationLottieProps {
  animationPath: object; // More specific type for Lottie animation data
  width?: string | number;
}

const AnimationLottie = ({ animationPath, width }: AnimationLottieProps) => {
  const defaultOptions: LottieComponentProps = {
    loop: true,
    autoplay: true,
    animationData: animationPath,
    style: {
      width: width || "95%",
    },
  };

  return <Lottie {...defaultOptions} />;
};

export default AnimationLottie;
