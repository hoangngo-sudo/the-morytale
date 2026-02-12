/**
 * Marquee component for seamless infinite scroll.
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
  'An interactive storytelling application where users build a weekly chain of posts called a track.'

const scissorsElement = (
  <div className="css-scissors">
    <div className="css-scissors__half">
      <div className="css-scissors__handle"></div>
      <div className="css-scissors__blade"></div>
    </div>
    <div className="css-scissors__half">
      <div className="css-scissors__blade"></div>
      <div className="css-scissors__handle"></div>
    </div>
    <div className="css-scissors__joint"></div>
  </div>
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
      aria-label="Scrolling banner: An interactive storytelling application where users build a weekly chain of posts called a track."
      role="marquee"
    >
      <div className="marquee-scissors" aria-hidden="true">
        {scissorsElement}
      </div>

      <div className="marquee">
        {marqueeContent}
        {marqueeContent}
      </div>
    </div>
  )
}

export default Marquee
