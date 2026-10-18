"use client";
import {useEffect} from "react";
export default function KineticMotion(){
 useEffect(()=>{
  const elements=[...document.querySelectorAll<HTMLElement>(".k-statement-main,.k-category-header,.k-category,.k-detail-copy,.k-partner-heading,.k-service-title,.k-end h2")];
  const obs=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){entry.target.classList.add("k-in");obs.unobserve(entry.target)}},{threshold:.1,rootMargin:"0px 0px -4% 0px"});
  elements.forEach(e=>obs.observe(e));
  let raf=0;
  const onScroll=()=>{if(raf)return;raf=requestAnimationFrame(()=>{const y=window.scrollY;document.documentElement.style.setProperty("--k-scroll",String(y));raf=0})};
  onScroll();window.addEventListener("scroll",onScroll,{passive:true});
  return()=>{obs.disconnect();window.removeEventListener("scroll",onScroll);cancelAnimationFrame(raf);document.documentElement.style.removeProperty("--k-scroll")};
 },[]);
 return null;
}
