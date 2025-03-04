import React, { useState } from "react";
import Navbar from "./Navbar";
import LandingHome from "./LandingHome";
import Particles from "./Particles"

export default function Home() {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Particles
          particleColors={['#ffffff', '#ffffff']}
          particleCount={600}
          particleSpread={14}
          speed={0.6}
          particleBaseSize={100}
          moveParticlesOnHover={false}
          alphaParticles={false}
          disableRotation={false}
        />
      </div>
      <div className="relative z-20">
        <Navbar/>
      </div>
      <div className="relative z-10">
        <LandingHome/>
      </div>
    </div>
  );
}