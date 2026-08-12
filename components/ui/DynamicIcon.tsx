import { 
  Droplet, Heart, ShieldCheck, Activity, Zap, Thermometer, Wheat,
  BriefcaseMedical, CheckCircle2, ChevronRight, BookOpen, Stethoscope,
  FlaskConical, ArrowRight, Beef, Bird, Dog
} from "lucide-react";
import React from "react";

const iconMap: Record<string, React.ElementType> = {
  Droplet,
  Heart,
  ShieldCheck,
  Activity,
  Zap,
  Thermometer,
  Wheat,
  BriefcaseMedical,
  CheckCircle2,
  ChevronRight,
  BookOpen,
  Stethoscope,
  FlaskConical,
  ArrowRight,
  Beef,
  Bird,
  Dog,
};

interface DynamicIconProps {
  name?: string | null;
  className?: string;
  fallback?: React.ElementType;
}

export function DynamicIcon({ name, className, fallback: Fallback = BriefcaseMedical }: DynamicIconProps) {
  if (!name) return <Fallback className={className} />;
  
  const Icon = iconMap[name];
  if (!Icon) return <Fallback className={className} />;
  
  return <Icon className={className} />;
}
