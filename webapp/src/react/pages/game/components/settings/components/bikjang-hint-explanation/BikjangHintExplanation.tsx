/**
 * What the bikjang hint does and where it is offered, in as few plain words as will do it on a phone.
 *
 * The reason it needs saying at all is the second paragraph: the hint is a preference, but against the
 * stronger bots it is not offered whatever the preference is, and a player who chose "Shown" and sees
 * nothing would otherwise take it for a fault. The rule is `bikjangHintShown`; what counts as a move
 * that leaves a bikjang to call is `canCallBikjangAfter`.
 */
export function BikjangHintExplanation(): React.JSX.Element {
  return (
    <div className="flex flex-col gap-2">
      <p>
        Writes <strong>빅장</strong> on a move that would leave the two generals facing each other, so your opponent
        could call a <strong>bikjang</strong>. In a scored game it appears only while one could really be called.
      </p>

      <p>
        Offered in games against a person at the same device, and against the 800 and 1000 bots. The stronger bots are
        played without it.
      </p>
    </div>
  );
}
