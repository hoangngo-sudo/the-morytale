/**
 * Marquee component — seamless infinite scroll.
 *
 * CSS animation technique by Ben Nadel.
 * @see https://www.bennadel.com/blog/4536-creating-a-marquee-effect-with-css-animations.htm
 *
 * Each .marquee__item independently translates from 0% to -100% of its own
 * width. Two identical items sit side-by-side in a flex container; when the
 * first item reaches -100% (fully off-screen left), it snaps back to 0% —
 * but because the animation is linear, the second item is at that exact
 * position, so the reset is invisible.
 */

const MARQUEE_TEXT =
  'an interactive storytelling application where users build a weekly chain of posts called a Track.'

/* ── Hoisted static elements (rendering-hoist-jsx) ── */

const scissorsSvg = (
  <img src="/scissors.svg" width="60" height="50" alt="" aria-hidden="true" />
)

const marqueeContent = (
  <span className="marquee__item">
    <span className="marquee__item-text font-hand fs-s">{MARQUEE_TEXT}</span>
  </span>
)

function Marquee() {
  return (
    <div
      className="marquee-banner"
      aria-label="Scrolling banner: an interactive storytelling application where users build a weekly chain of posts called a Track."
      role="marquee"
    >
      <div className="marquee-scissors" aria-hidden="true">
        {scissorsSvg}
      </div>

      <div className="marquee">
        {marqueeContent}
        {marqueeContent}
      </div>
    </div>
  )
}

export default Marquee
