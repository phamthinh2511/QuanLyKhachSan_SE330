"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import clsx from "clsx";

export interface CustomSelectProps {
  value?: string;
  onChange?: (e: { target: { value: string; name?: string } }) => void;
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
  name?: string;
  id?: string;
}

const getReactElementText = (node: React.ReactNode): string => {
  if (node === null || node === undefined) return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(getReactElementText).join("");
  if (React.isValidElement(node)) {
    const element = node as React.ReactElement<{ children?: React.ReactNode }>;
    return getReactElementText(element.props.children);
  }
  return "";
};

export default function CustomSelect({
  value,
  onChange,
  className = "",
  children,
  disabled = false,
  name,
  id,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Parse children into options
  const options: { value: string; label: string; disabled: boolean }[] = [];
  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child)) {
      const element = child as React.ReactElement<{ value?: any; children?: React.ReactNode; disabled?: boolean }>;
      if (element.type === "option") {
        const val = element.props.value !== undefined ? String(element.props.value) : getReactElementText(element.props.children);
        options.push({
          value: val,
          label: getReactElementText(element.props.children),
          disabled: !!element.props.disabled,
        });
      } else if (element.props && element.props.children) {
        React.Children.forEach(element.props.children, (subChild) => {
          if (React.isValidElement(subChild)) {
            const subElement = subChild as React.ReactElement<{ value?: any; children?: React.ReactNode; disabled?: boolean }>;
            if (subElement.type === "option") {
              const val = subElement.props.value !== undefined ? String(subElement.props.value) : getReactElementText(subElement.props.children);
              options.push({
                value: val,
                label: getReactElementText(subElement.props.children),
                disabled: !!subElement.props.disabled,
              });
            }
          }
        });
      }
    }
  });

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);
  const displayText = selectedOption ? selectedOption.label : (value || "");

  const handleSelect = (val: string, optDisabled: boolean) => {
    if (optDisabled) return;
    setIsOpen(false);
    if (onChange) {
      onChange({
        target: {
          value: val,
          name: name,
        },
      });
    }
  };

  const isWFull = className.includes("w-full");

  return (
    <div
      ref={containerRef}
      className={clsx(
        "relative",
        isWFull ? "w-full" : "inline-block",
        disabled && "opacity-60 cursor-not-allowed"
      )}
    >
      <button
        type="button"
        id={id}
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          "w-full flex items-center justify-between gap-2 bg-white text-left transition-all cursor-pointer outline-none focus:ring-2 focus:ring-blue-500",
          className
        )}
        style={{
          backgroundImage: "none",
          paddingRight: className.includes("pr-") ? undefined : "1.5rem",
        }}
      >
        <span className="truncate">{displayText}</span>
        <ChevronDown
          className={clsx(
            "w-4 h-4 text-gray-500 transition-transform duration-200 shrink-0",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto py-1">
          {options.length === 0 ? (
            <div className="px-4 py-2 text-sm text-gray-400">Không có tùy chọn</div>
          ) : (
            options.map((opt, idx) => {
              const isSelected = opt.value === value;
              return (
                <div
                  key={`${opt.value}-${idx}`}
                  onClick={() => handleSelect(opt.value, opt.disabled)}
                  className={clsx(
                    "flex items-center justify-between px-4 py-2.5 text-sm cursor-pointer transition-colors truncate",
                    opt.disabled
                      ? "text-gray-400 bg-gray-50/50 cursor-not-allowed"
                      : isSelected
                      ? "bg-blue-50/80 text-blue-600 font-semibold"
                      : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                  )}
                >
                  <span className="truncate">{opt.label}</span>
                  {isSelected && <Check className="w-4 h-4 text-blue-600 shrink-0 ml-2" />}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
