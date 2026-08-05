type CatSilhouetteProps = {
  width?: number | string;
  height?: number | string;
  className?: string;
};

export const CatSilhouette = ({
  width = 200,
  height = 200,
  className,
}: CatSilhouetteProps) => (
  <svg
    viewBox="0 0 200 200"
    width={width}
    height={height}
    className={className}
    aria-hidden="true">
    <path
      d="M165 150 Q190 145 186 115 Q183 90 160 88"
      fill="none"
      stroke="currentColor"
      strokeWidth="11"
      strokeLinecap="round"
    />
    <ellipse
      cx="115"
      cy="118"
      rx="62"
      ry="52"
      fill="currentColor"
    />
    <path
      d="M36 72 L28 36 L62 60 Z"
      fill="currentColor"
    />
    <path
      d="M76 66 L90 32 L98 62 Z"
      fill="currentColor"
    />
    <path
      d="M42 66 L38 44 L58 58 Z"
      className="fill-background"
    />
    <path
      d="M80 60 L88 40 L94 58 Z"
      className="fill-background"
    />
    <circle
      cx="58"
      cy="96"
      r="34"
      fill="currentColor"
    />
    <path
      d="M28 104 L40 110 L28 116 Z"
      className="fill-background"
    />
    <g
      className="stroke-background"
      strokeWidth="2.5"
      strokeLinecap="round">
      <path d="M22 104 L4 100" />
      <path d="M22 112 L4 112" />
      <path d="M22 120 L6 124" />
    </g>
    <ellipse
      cx="75"
      cy="160"
      rx="20"
      ry="11"
      fill="currentColor"
    />
  </svg>
);

const CatCluster = () => (
  <svg
    viewBox="0 0 1000 500"
    className="text-foreground mx-auto h-auto w-full max-w-4xl"
    role="img"
    aria-label="404 - a cat curled up inside a lens">
    <defs>
      <filter
        id="trail-blur"
        x="-20%"
        y="-20%"
        width="140%"
        height="140%">
        <feGaussianBlur stdDeviation="4" />
      </filter>
      <filter
        id="lens-aura"
        x="-20%"
        y="-20%"
        width="140%"
        height="140%">
        <feGaussianBlur stdDeviation="14" />
      </filter>
      <radialGradient
        id="lens-gloss"
        cx="35%"
        cy="30%"
        r="75%">
        <stop
          offset="0%"
          stopColor="#fff"
          stopOpacity="0.35"
        />
        <stop
          offset="100%"
          stopColor="#fff"
          stopOpacity="0"
        />
      </radialGradient>
    </defs>

    <text
      x="230"
      y="250"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize="300"
      fill="currentColor"
      opacity="0.1"
      className="font-heading">
      4
    </text>
    <text
      x="770"
      y="250"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize="300"
      fill="currentColor"
      opacity="0.1"
      className="font-heading">
      4
    </text>

    <path
      className="trail-draw"
      pathLength="1"
      d="M715 345 Q645 450 545 335 Q505 285 500 252"
      fill="none"
      stroke="currentColor"
      strokeWidth="7"
      strokeLinecap="round"
      opacity="0.25"
      filter="url(#trail-blur)"
    />

    <g className="lens-pulse">
      <circle
        cx="500"
        cy="250"
        r="160"
        fill="currentColor"
        opacity="0.05"
      />
      <circle
        cx="500"
        cy="250"
        r="160"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.15"
      />
      <circle
        cx="500"
        cy="250"
        r="150"
        fill="currentColor"
        opacity="0.08"
        filter="url(#lens-aura)"
      />
      <circle
        cx="500"
        cy="250"
        r="160"
        fill="url(#lens-gloss)"
      />

      <g className="cat-breathe">
        <g transform="translate(415,165) scale(0.85)">
          <CatSilhouette
            width={200}
            height={200}
          />
        </g>
      </g>

      <text
        x="372"
        y="250"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="40"
        fill="currentColor"
        className="font-heading">
        4
      </text>
      <text
        x="628"
        y="250"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="40"
        fill="currentColor"
        className="font-heading">
        4
      </text>
    </g>
  </svg>
);

export default CatCluster;
