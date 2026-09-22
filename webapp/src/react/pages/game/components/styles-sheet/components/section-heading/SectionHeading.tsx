/** The heading of a section of the styles sheet: Your own, Import, Make your own. */
interface Props {
  readonly children: React.ReactNode;
}

export function SectionHeading({children}: Props): React.JSX.Element {
  return (
    <h3 className="border-b border-white/10 pb-1 text-xs font-semibold tracking-wide text-white/40 uppercase">
      {children}
    </h3>
  );
}
