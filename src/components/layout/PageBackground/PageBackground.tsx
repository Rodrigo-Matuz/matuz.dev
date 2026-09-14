interface PageBackgroundProps {
    src?: string;
}

export function PageBackground({ src }: PageBackgroundProps) {
    return (
        <div
            aria-hidden="true"
            className="
        pointer-events-none
        fixed inset-0 z-0
        overflow-hidden
        bg-background
      "
        >
            {src && (
                <img
                    src={src}
                    alt=""
                    className="
            absolute inset-0
            h-full w-full
            scale-105
            object-cover
            opacity-35
            blur-sm
          "
                />
            )}

            {/* Temporary abstract treatment. Swap `src` for a generated image later. */}
            <div
                className="
          absolute inset-0
          bg-[radial-gradient(
            circle_at_85%_5%,
            color-mix(in_srgb,var(--color-secondary)_14%,transparent),
            transparent_35%
          )]
        "
            />
            <div className="absolute -left-40 top-[28rem] size-[32rem] rounded-full bg-primary/[0.05] blur-3xl" />

            {/* Fade into page background */}
            <div
                className="
          absolute inset-0
          bg-[linear-gradient(
            to_bottom,
            transparent_0%,
            color-mix(in_srgb,var(--color-background)_35%,transparent)_50%,
            var(--color-background)_100%
          )]
        "
            />
        </div>
    );
}

export default PageBackground;
