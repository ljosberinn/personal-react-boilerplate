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
export default function SecuritySvg({ height, className }) {
  const { theme } = useTheme();

  const { primary, purple } = getThemeBasedSvgColor(theme);

  const purpleWhenLight = theme === 'light' ? purple : '#f5f5f5';

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 895.68 517.48"
      height={height}
      className={className}
      aria-hidden
    >
      <defs>
        <linearGradient
          id="a"
          x1="790.94"
          x2="790.94"
          y1="640.76"
          y2="264.76"
          gradientTransform="rotate(90 783.095 446.895)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="gray" stopOpacity=".25" />
          <stop offset=".54" stopColor="gray" stopOpacity=".12" />
          <stop offset="1" stopColor="gray" stopOpacity=".1" />
        </linearGradient>
        <linearGradient
          id="b"
          x1="785.97"
          x2="785.97"
          y1="446.14"
          y2="321.91"
          gradientTransform="rotate(90 783.305 383.365)"
        />
        <linearGradient
          id="c"
          x1="660.92"
          x2="660.92"
          y1="518.19"
          y2="494.17"
          gradientTransform="rotate(90 659.87 486.97)"
        />
        <linearGradient
          id="d"
          x1="433.66"
          x2="433.66"
          y1="605.23"
          y2="235.23"
          gradientTransform="translate(13.58 8.51)"
        />
        <linearGradient
          id="e"
          x1="428.36"
          x2="428.36"
          y1="413.71"
          y2="291.46"
          gradientTransform="translate(-1.05 11.3)"
        />
        <linearGradient
          id="f"
          x1="295.22"
          x2="295.22"
          y1="484.61"
          y2="460.98"
          gradientTransform="translate(28.38 37.45)"
        />
        <linearGradient id="g" x1="455.07" x2="455.07" y1="464.48" y2="10.48" />
        <linearGradient id="h" x1="449.07" x2="449.07" y1="229.48" y2="79.48" />
        <linearGradient
          id="i"
          x1="298.07"
          x2="298.07"
          y1="316.48"
          y2="287.48"
        />
        <linearGradient
          id="j"
          x1="457.07"
          x2="457.07"
          y1="517.48"
          y2="364.48"
        />
        <linearGradient
          id="k"
          x1="611.23"
          x2="611.23"
          y1="564.74"
          y2="464.74"
        />
        <linearGradient
          id="l"
          x1="611.23"
          x2="611.23"
          y1="660.74"
          y2="602.74"
        />
      </defs>
      <path
        fill={purpleWhenLight}
        d="M415.96671357 68.34968968l2.9864847-19.65439669 465.07166725 70.66761938-2.98648471 19.65439668z"
      />
      <path
        fill="url(#a)"
        d="M589.23 209.59h376v490.29h-376z"
        transform="rotate(-81.36 589.88238658 447.62674005)"
      />
      <path
        fill={purpleWhenLight}
        d="M364.44677797 407.32465688L415.9546257 68.34563316l465.07166724 70.66761938-51.50784774 338.97902372z"
      />
      <circle
        cx="580.99"
        cy="251.51"
        r="4.86"
        fill="#ff5252"
        transform="rotate(-81.36 393.64195902 244.40038174)"
      />
      <circle
        cx="594.2"
        cy="253.52"
        r="4.86"
        fill="#ff0"
        transform="rotate(-81.36 406.84806115 246.4053422)"
      />
      <circle
        cx="607.41"
        cy="255.53"
        r="4.86"
        fill="#69f0ae"
        transform="rotate(-81.36 420.05998041 248.41530266)"
      />
      <path
        fill="url(#b)"
        d="M720.53 174.84h124.23v422.38H720.53z"
        transform="rotate(-81.36 595.29908063 378.9200065)"
      />
      <path
        fill={primary}
        d="M435.20261206 107.29101198l408.58010654 62.08372921-17.29396982 113.81358886-408.58010654-62.08372922z"
      />
      <path
        fill="url(#c)"
        d="M628.65 473.94h24.02v28.16h-24.02z"
        transform="rotate(-81.36 453.30439186 480.90389267)"
      />
      <path
        fill={primary}
        d="M477.3773868 284.58224091l26.19927123 3.98097811-2.98648471 19.65439669-26.19927124-3.98097811z"
      />
      <path
        fill="#ff5252"
        d="M472.26230335 318.15362722l26.19927124 3.98097811-2.98648471 19.65439669-26.19927124-3.98097811z"
      />
      <path
        fill="#ff9800"
        d="M467.16710643 351.72651579l26.19927123 3.9809781-2.9864847 19.6543967-26.19927124-3.98097812z"
      />
      <path
        fill={primary}
        d="M546.3461984 299.25059775l211.2452183 32.09870162-1.74111457 11.45847373-211.2452183-32.09870163zM541.24100148 332.82348631l211.2452183 32.09870163-1.74111458 11.45847372-211.2452183-32.09870163zM536.14580456 366.39637488l211.2452183 32.09870163-1.74111458 11.45847372-211.2452183-32.09870163z"
        opacity=".4"
      />
      <path
        fill={purpleWhenLight}
        d="M10.88678903 118.11307821L499.66494008 8.8582172l4.2668818 19.08893187L15.15367083 137.20201008z"
      />
      <path
        fill="url(#d)"
        d="M186.23 243.74h522v370h-522z"
        transform="rotate(-12.6 -495.08329595 1022.24937017)"
      />
      <path
        fill={purpleWhenLight}
        d="M15.15027587 137.21301078L503.92842692 27.95814976l73.60152965 329.27431548L88.75180552 466.48732626z"
      />
      <ellipse
        cx="177.11"
        cy="316.25"
        fill="#ff5252"
        rx="5.17"
        ry="4.78"
        transform="rotate(-12.6 -765.18207419 909.73223226)"
      />
      <ellipse
        cx="191"
        cy="313.15"
        fill="#ff0"
        rx="5.17"
        ry="4.78"
        transform="rotate(-12.6 -751.27140189 906.63799948)"
      />
      <ellipse
        cx="204.88"
        cy="310.05"
        fill="#69f0ae"
        rx="5.17"
        ry="4.78"
        transform="rotate(-12.6 -737.40601903 903.5387667)"
      />
      <path
        fill="url(#e)"
        d="M202.46 302.76h449.7v122.25h-449.7z"
        transform="rotate(-12.6 -514.96906167 957.38871467)"
      />
      <path
        fill={primary}
        d="M48.6125531 165.6367311l429.40337525-95.9830262 24.71126638 110.55185079L73.32381948 276.1885819z"
      />
      <path
        fill="url(#f)"
        d="M308.61 498.42h29.98v23.63h-29.98z"
        transform="rotate(-12.6 -618.68187953 1103.72494454)"
      />
      <path
        fill={primary}
        d="M158.0646 313.4782l27.6556-6.2084 4.3032 19.1688-27.6556 6.2084z"
      />
      <path
        fill="#ff5252"
        d="M163.16926962 344.6264052l27.54037102-6.15600228 4.2668818 19.08893187-27.54037102 6.15600227z"
      />
      <path
        fill="#ff9800"
        d="M172.8314 378.9362l27.6556-6.2084 4.3032 19.1688-27.6556 6.2084z"
      />
      <path
        fill={primary}
        d="M229.90848542 299.63964185l222.01130417-49.62540599 2.48901439 11.13521026L232.3974998 310.7748521zM237.19656972 332.25402322l222.01130417-49.62540598 2.48901438 11.13521025-222.01130417 49.62540599zM244.48465401 364.8584046l222.01130418-49.62540598 2.48901438 11.13521025-222.01130417 49.62540598z"
        opacity=".4"
      />
      <path fill={purpleWhenLight} d="M170.07 18.48h568v24h-568z" />
      <path fill="url(#g)" d="M159.07 10.48h592v454h-592z" />
      <path fill={purpleWhenLight} d="M170.07 42.48h568v414h-568z" />
      <circle cx="183.94" cy="30.48" r="5.87" fill="#ff5252" />
      <circle cx="200.07" cy="30.48" r="5.87" fill="#ff0" />
      <circle cx="216.2" cy="30.48" r="5.87" fill="#69f0ae" />
      <path fill="url(#h)" d="M194.07 79.48h510v150h-510z" />
      <path fill={primary} d="M200.07 85.48h499v139h-499z" />
      <path fill="url(#i)" d="M281.07 287.48h34v29h-34z" />
      <path fill={primary} d="M282.57 289.48h32v24h-32z" />
      <path fill="#ff5252" d="M282.57 330.48h32v24h-32z" />
      <path fill="#ff9800" d="M282.57 371.48h32v24h-32z" />
      <path
        fill={primary}
        d="M367.57 294.48h258v14h-258zM367.57 335.48h258v14h-258zM367.57 376.48h258v14h-258z"
        opacity=".4"
      />
      <path fill="url(#j)" d="M364.07 364.48h186v153h-186z" />
      <path
        fill="url(#k)"
        d="M559.15 531.41a52.08 52.08 0 01104.17 0v33.33h14.58v-33.33a66.67 66.67 0 10-133.33 0v33.33h14.58z"
        transform="translate(-152.16 -191.26)"
      />
      <path
        fill={primary}
        d="M409.07 339.48a50 50 0 01100 0v32h14v-32a64 64 0 00-128 0v32h14z"
      />
      <path fill={primary} d="M372.07 369.48h174v142h-174z" />
      <path fill={primary} d="M372.07 369.48h174v142h-174z" />
      <path fill={primary} d="M372.07 397.48h174v86h-174z" />
      <path
        fill="url(#l)"
        d="M624 615.5a12.76 12.76 0 10-22 8.74v27.22a9.28 9.28 0 0018.56 0v-27.22a12.7 12.7 0 003.44-8.74z"
        transform="translate(-152.16 -191.26)"
      />
      <path
        d="M470.07 426.48a11 11 0 10-19 7.53v23.47a8 8 0 1016 0v-23.47a11 11 0 003-7.53z"
        opacity=".2"
      />
    </svg>
  );
}
