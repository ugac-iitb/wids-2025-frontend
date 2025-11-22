"use client";

import { useMemo, useState } from "react";
import { ResourceItem } from "@/types/resourceitem";
import { motion } from "framer-motion";

const ResourceCard = ({ resource }: { resource: ResourceItem }) => {
  const { resource_name, resource_link } = resource;
  const link = resource_link?.trim() || "#";

  // Safe domain extraction
  const domain = useMemo(() => {
    try {
      return new URL(link).hostname.replace(/^www\./, "");
    } catch {
      return "";
    }
  }, [link]);

  // initials for placeholder
  const initials = useMemo(() => {
    const source = resource_name || domain || "R";
    const parts = source.split(/[\s.-]+/).filter(Boolean);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }, [resource_name, domain]);

  // choose a color based on domain to make placeholders varied
  const bgColor = useMemo(() => {
    const palette = ["#6A6FDB", "#F472B6", "#34D399", "#60A5FA", "#F59E0B", "#A78BFA"];
    const key = domain || resource_name || "x";
    const sum = Array.from(key).reduce((s, ch) => s + ch.charCodeAt(0), 0);
    return palette[sum % palette.length];
  }, [domain, resource_name]);

  // svg data-uri fallback
  const placeholderDataUri = useMemo(() => {
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='128' height='128'>
      <rect width='100%' height='100%' fill='${bgColor}' rx='24' />
      <text x='50%' y='54%' dominant-baseline='middle' text-anchor='middle' font-family='Inter, Roboto, system-ui, sans-serif' font-size='48' fill='white'>${initials}</text>
    </svg>`;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  }, [bgColor, initials]);

  const faviconUrl = `https://www.google.com/s2/favicons?sz=128&domain_url=${encodeURIComponent(link)}`;

  const [imgSrc, setImgSrc] = useState(faviconUrl);

  // if link is empty or "#", use placeholder immediately
  if (link === "#") {
    // ensure not to attempt loading invalid favicon
    if (imgSrc !== placeholderDataUri) setImgSrc(placeholderDataUri);
  }

  return (
    <motion.a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      variants={{
        hidden: { opacity: 0, y: 12 },
        visible: { opacity: 1, y: 0 },
      }}
      initial="hidden"
      whileInView="visible"
      transition={{ duration: 0.5, delay: 0.08 }}
      viewport={{ once: true }}
      className="flex flex-col overflow-hidden rounded-xl border border-transparent bg-gradient-to-b from-[#0f0b10] to-[#121018] hover:from-[#14121A] hover:to-[#15141A] transform transition-shadow duration-200 hover:-translate-y-1 hover:shadow-lg cursor-pointer"
      aria-label={`Open resource: ${resource_name}`}
    >
      {/* Header: favicon / placeholder + domain */}
      <div className="flex items-center gap-4 px-4 py-3 border-b border-white/5">
        <div className="flex items-center justify-center w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
          <img
            src={imgSrc}
            alt={`${domain || resource_name} icon`}
            className="w-12 h-12 object-cover rounded-md bg-white/5"
            onError={() => {
              if (imgSrc !== placeholderDataUri) setImgSrc(placeholderDataUri);
            }}
          />
        </div>

        <div className="min-w-0">
          <div className="text-sm font-medium text-white/90 truncate">{resource_name}</div>
          {domain ? (
            <div className="text-xs text-white/60 truncate">{domain}</div>
          ) : (
            <div className="text-xs text-white/40 truncate">External link</div>
          )}
        </div>
      </div>

      {/* Body: short preview / improved title area */}
      <div className="px-4 py-4 flex-1 flex items-center">
        <h3 className="text-sm leading-snug text-white/90 line-clamp-3 w-full">
          {resource_name}
        </h3>
      </div>

      {/* Footer: small action hint */}
      <div className="px-4 py-3 border-t border-white/3 text-xs text-white/50">
        Open in new tab
      </div>
    </motion.a>
  );
};

export default ResourceCard;
