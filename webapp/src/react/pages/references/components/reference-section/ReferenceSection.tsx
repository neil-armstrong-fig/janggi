import type {ReferenceSection as Section} from "@src/react/pages/references/types/ReferenceSection";
import {ReferenceEntry} from "@src/react/pages/references/components/reference-section/components/reference-entry/ReferenceEntry";

interface Props {
  readonly section: Section;
}

export function ReferenceSection({section}: Props): React.JSX.Element {
  return (
    <section id={section.id} aria-labelledby={`${section.id}-heading`} tabIndex={-1} className="scroll-mt-8">
      <h2
        id={`${section.id}-heading`}
        data-testid={`references-${section.id}-heading`}
        className="text-2xl font-semibold tracking-tight"
      >
        {section.title}
      </h2>

      <p className="mt-3 leading-relaxed text-wood/80">{section.introduction}</p>

      <ul className="mt-5 divide-y divide-wood/15">
        {section.references.map(reference => (
          <ReferenceEntry key={reference.id} reference={reference} />
        ))}
      </ul>
    </section>
  );
}
