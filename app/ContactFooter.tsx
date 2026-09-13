import { LocalTime } from "./LocalTime";
import { ScrollReveal } from "./ScrollReveal";

const contactTitle = "Let’s build together!";

export function ContactFooter() {
  return (
    <ScrollReveal><footer className="contactFooter" id="contact">
      <div className="contactMain">
        <h2 className="contactWordmark" aria-label={contactTitle}>
          {contactTitle.split(" ").map((word, wordIndex) => (
            <span className="contactWord" aria-hidden="true" key={word}>
              {word.split("").map((letter, letterIndex) => (
                <span className="contactLetter" key={`${letter}-${letterIndex}`} style={{ animationDelay: `-${(wordIndex * 0.7 + letterIndex * 0.22).toFixed(2)}s` }}>{letter}</span>
              ))}
            </span>
          ))}
        </h2>
        <div className="contactLinks"><a href="mailto:hi@guymagen.com" data-analytics-event="Contact Clicked" data-analytics-channel="email">email ↗</a><a href="https://wa.me/972547734245" target="_blank" rel="noreferrer" data-analytics-event="Contact Clicked" data-analytics-channel="whatsapp">whatsapp ↗</a><a href="https://www.linkedin.com/in/guymagen/" target="_blank" rel="noreferrer" data-analytics-event="Contact Clicked" data-analytics-channel="linkedin">linkedin ↗</a><a href="https://github.com/guymgn" target="_blank" rel="noreferrer" data-analytics-event="Contact Clicked" data-analytics-channel="github">github ↗</a></div>
      </div>
      <div className="footerMeta">
        <LocalTime />
      </div>
    </footer></ScrollReveal>
  );
}
