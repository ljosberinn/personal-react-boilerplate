import React from 'react';

import getThemeBasedSvgColor from '../../constants/svgColor';
import { useTheme } from '../../context';

/**
 *
 * @param {{
 * height: string | number;
 * className: string;
 * }} props
 */
export default function AnalyticsSvg({ height, className }) {
  const { theme } = useTheme();

  const { primary, purple } = getThemeBasedSvgColor(theme);

  const purpleWhenLight = theme === 'light' ? purple : '#fff';

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 882 763.27"
      height={height}
      className={className}
      aria-hidden
    >
      <defs>
        <linearGradient
          id="a"
          x1="673"
          x2="673"
          y1="763.27"
          y2="341"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="gray" stopOpacity=".25" />
          <stop offset=".54" stopColor="gray" stopOpacity=".12" />
          <stop offset="1" stopColor="gray" stopOpacity=".1" />
        </linearGradient>
        <linearGradient id="b" x1="640" x2="640" y1="537.58" y2="459.58" />
        <linearGradient id="c" x1="736" x2="736" y1="591.58" y2="513.58" />
        <linearGradient id="d" x1="688" x2="688" y1="645.58" y2="567.58" />
        <linearGradient id="e" x1="822" x2="822" y1="699.58" y2="621.58" />
        <linearGradient id="f" x1="209" x2="209" y1="422.27" y2="0" />
        <linearGradient id="g" x1="405" x2="405" y1="582.71" y2="160.45" />
        <linearGradient id="h" x1="500.8" x2="500.8" y1="592.09" y2="468.22" />
      </defs>
      <path fill="url(#a)" d="M464 341h418v422.27H464z" />
      <path fill={purpleWhenLight} d="M469.69 407.82h406.63v344.07H469.69z" />
      <path fill={purpleWhenLight} d="M469.69 345.27h406.63v62.56H469.69z" />
      <circle cx="500.97" cy="376.54" r="15.64" fill="#ff5252" />
      <circle cx="540.78" cy="376.54" r="15.64" fill="#ff0" />
      <circle cx="580.59" cy="376.54" r="15.64" fill="#69f0ae" />
      <path
        fill="#e0e0e0"
        d="M505.5 488.36h335v21h-335zM505.5 542.36h335v21h-335zM505.5 596.36h335v21h-335zM505.5 650.36h335v21h-335z"
      />
      <circle cx="640" cy="498.58" r="39" fill="url(#b)" />
      <circle cx="736" cy="552.58" r="39" fill="url(#c)" />
      <circle cx="688" cy="606.58" r="39" fill="url(#d)" />
      <circle cx="822" cy="660.58" r="39" fill="url(#e)" />
      <circle cx="640" cy="498.58" r="33" fill={primary} />
      <circle cx="736" cy="552.58" r="33" fill={primary} />
      <circle cx="688" cy="606.58" r="33" fill={primary} />
      <circle cx="822" cy="660.58" r="33" fill="#69f0ae" />
      <path fill="url(#f)" d="M0 0h418v422.27H0z" />
      <path fill={purpleWhenLight} d="M5.69 66.82h406.63v344.07H5.69z" />
      <path fill={purpleWhenLight} d="M5.69 4.27h406.63v62.56H5.69z" />
      <circle cx="36.97" cy="35.54" r="15.64" fill="#ff5252" />
      <circle cx="76.78" cy="35.54" r="15.64" fill="#ff0" />
      <circle cx="116.59" cy="35.54" r="15.64" fill="#69f0ae" />
      <path
        fill="#e0e0e0"
        d="M94.63 149.29h38.26v179.14H94.63zM158.12 149.29h38.26v179.14h-38.26zM221.6 149.29h38.26v179.14H221.6zM285.08 149.29h38.26v179.14h-38.26z"
      />
      <path fill="#2196f3" d="M94.63 238.86h38.26v89.57H94.63z" />
      <path fill="#2196f3" d="M94.63 201.46h38.26v39.13H94.63z" opacity=".4" />
      <path fill="#69f0ae" d="M158.47 220h38.26v39.13h-38.26z" opacity=".4" />
      <path fill="#ff0" d="M285.1 222.05h38.26v39.13H285.1z" opacity=".4" />
      <path fill="#69f0ae" d="M158.12 258.3h38.26v70.12h-38.26z" />
      <path fill={primary} d="M221.6 225.81h38.26v102.62H221.6z" />
      <path fill={primary} d="M221.6 190.16h38.26v35.65H221.6z" opacity=".4" />
      <path fill="#ff0" d="M285.08 261.47h38.26v66.96h-38.26z" />
      <path fill="url(#g)" d="M196 160.45h418v422.27H196z" />
      <path fill={purpleWhenLight} d="M201.69 227.27h406.63v344.07H201.69z" />
      <path fill={purpleWhenLight} d="M201.69 164.71h406.63v62.56H201.69z" />
      <circle cx="232.97" cy="195.99" r="15.64" fill="#ff5252" />
      <circle cx="272.78" cy="195.99" r="15.64" fill="#ff0" />
      <circle cx="312.59" cy="195.99" r="15.64" fill="#69f0ae" />
      <path fill="#2196f3" d="M405 281.29h-.71v236h.71a118 118 0 000-236z" />
      <path fill="#69f0ae" d="M404.29 281.31A118 118 0 00287 398.63h117.29z" />
      <path
        fill="url(#h)"
        d="M439.61 468.22v.74A123.14 123.14 0 00562 592.09V468.22z"
        transform="translate(-159 -68.37)"
      />
      <path
        fill={primary}
        d="M284.17 401.43v.71a118 118 0 00117.3 118V401.43z"
      />
    </svg>
  );
}
