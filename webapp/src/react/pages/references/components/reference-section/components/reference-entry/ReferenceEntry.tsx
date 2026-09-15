import type {Reference} from "@src/react/pages/references/types/Reference";

interface Props {
  readonly reference: Reference;
}

export function ReferenceEntry({reference}: Props): React.JSX.Element {
  return (
    <li className="py-5">
      <h3 className="font-semibold">
        <a
          data-testid={`reference-${reference.id}`}
          href={reference.url}
          className="underline decoration-wood/40 underline-offset-4 hover:decoration-gold"
        >
          {reference.name}
        </a>
      </h3>

      <p className="mt-2 text-sm leading-relaxed text-wood/80">{reference.description}</p>

      {reference.licence && (
        <a
          href={`https://spdx.org/licenses/${reference.licence}.html`}
          className="mt-3 inline-block text-xs text-gold underline underline-offset-4"
        >
          {reference.licence} licence
        </a>
      )}

      {reference.related && (
        <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-3 text-sm">
          {reference.related.map(link => (
            <li key={link.id}>
              <a
                data-testid={`reference-${link.id}`}
                href={link.url}
                className="underline decoration-wood/30 underline-offset-4 hover:decoration-gold"
              >
                {link.name}
              </a>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}
