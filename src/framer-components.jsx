import { motion, useScroll, useSpring } from "framer-motion";

export const easeOut = [0.22, 1, 0.36, 1];

const reveal = {
  hidden: { opacity: 0, y: 34, filter: "blur(10px)" },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.72, delay, ease: easeOut }
  })
};

const splitWrap = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.032, delayChildren: 0.04 }
  }
};

const splitWord = {
  hidden: { opacity: 0, y: "1.1em", rotateX: -38 },
  show: {
    opacity: 1,
    y: "0em",
    rotateX: 0,
    transition: { duration: 0.52, ease: easeOut }
  }
};

const groupWrap = {
  hidden: {},
  show: (stagger = 0.05) => ({
    transition: { staggerChildren: stagger }
  })
};

const groupItem = {
  hidden: { opacity: 0, y: 32, scale: 0.96 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: easeOut }
  }
};

export function InView({ as = "div", className = "", delay = 0, children, ...props }) {
  const Component = motion[as] || motion.div;

  return (
    <Component
      className={`${className} reveal is-visible`.trim()}
      custom={delay}
      variants={reveal}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.18, margin: "0px 0px -8% 0px" }}
      {...props}
    >
      {children}
    </Component>
  );
}

export function TextEffect({ as = "p", className = "", children, delay = 0, ...props }) {
  const Component = motion[as] || motion.p;
  const words = String(children).trim().split(/\s+/);

  return (
    <Component
      className={`${className} split reveal is-visible`.trim()}
      variants={splitWrap}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.18, margin: "0px 0px -8% 0px" }}
      transition={{ delay }}
      aria-label={children}
      {...props}
    >
      {words.map((word, index) => (
        <motion.span
          className="word"
          variants={splitWord}
          style={{ "--word-index": index }}
          aria-hidden="true"
          key={`${word}-${index}`}
        >
          {word}
          {index < words.length - 1 ? "\u00a0" : ""}
        </motion.span>
      ))}
    </Component>
  );
}

export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    mass: 0.28
  });

  return <motion.div className="scroll-progress" aria-hidden="true" style={{ scaleX }} />;
}

export function AnimatedGroup({
  as = "div",
  className = "",
  children,
  stagger = 0.05,
  amount = 0.18,
  ...props
}) {
  const Component = motion[as] || motion.div;

  return (
    <Component
      className={`${className} reveal is-visible`.trim()}
      custom={stagger}
      variants={groupWrap}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
      {...props}
    >
      {children}
    </Component>
  );
}

export function MotionItem({ as = "div", children, ...props }) {
  const Component = motion[as] || motion.div;

  return (
    <Component variants={groupItem} {...props}>
      {children}
    </Component>
  );
}

export function MotionCard({
  as = "a",
  className = "",
  children,
  hover = { y: -8 },
  tap = { scale: 0.98 },
  ...props
}) {
  const Component = motion[as] || motion.a;

  return (
    <Component
      className={`${className} magnetic`.trim()}
      variants={groupItem}
      whileHover={hover}
      whileTap={tap}
      {...props}
    >
      {children}
    </Component>
  );
}

export function MotionDock({ items, className = "", ...props }) {
  return (
    <AnimatedGroup
      className={`${className} reveal is-visible`.trim()}
      aria-label="Tools Lohith works with"
      stagger={0.035}
      amount={0.2}
      {...props}
    >
      {items.map(([name, src]) => (
        <MotionItem as="img" src={src} alt={name} key={name} whileHover={{ y: -12, scale: 1.22, zIndex: 2 }} />
      ))}
    </AnimatedGroup>
  );
}

export function GradientRevealText({ as = "h2", className = "", children, ...props }) {
  const Component = motion[as] || motion.h2;

  return (
    <Component
      className={`${className} gradient-reveal reveal is-visible`.trim()}
      initial={{ opacity: 0, clipPath: "inset(0 100% 0 0)" }}
      whileInView={{ opacity: 1, clipPath: "inset(0 0% 0 0)" }}
      viewport={{ once: true, amount: 0.32 }}
      transition={{ duration: 0.9, ease: easeOut }}
      {...props}
    >
      {children}
    </Component>
  );
}

export function SequenceMeter({ steps, activeIndex, className = "" }) {
  return (
    <div className={`${className} sequence-meter`.trim()} aria-hidden="true">
      {steps.map((step, index) => (
        <motion.span
          className={index <= activeIndex ? "active" : ""}
          key={step.title}
          animate={{
            opacity: index <= activeIndex ? 1 : 0.36,
            scaleX: index <= activeIndex ? 1 : 0.56
          }}
          transition={{ type: "spring", stiffness: 230, damping: 24 }}
        >
          <i>{String(index + 1).padStart(2, "0")}</i>
          <b>{step.title}</b>
        </motion.span>
      ))}
    </div>
  );
}

export function TagPillStack({ tags = "", className = "" }) {
  const list = Array.isArray(tags)
    ? tags
    : String(tags)
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

  return (
    <div className={`${className} tag-pill-stack`.trim()} aria-label="Role skills">
      {list.map((tag, index) => (
        <motion.span
          key={tag}
          initial={{ opacity: 0, y: 10, rotate: index % 2 === 0 ? -2 : 2 }}
          whileInView={{ opacity: 1, y: 0, rotate: index % 2 === 0 ? -1 : 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.35, delay: index * 0.035, ease: easeOut }}
          whileHover={{ y: -4, scale: 1.04, rotate: 0 }}
        >
          {tag}
        </motion.span>
      ))}
    </div>
  );
}

export function CMSHoverGallery({ items, renderItem, className = "" }) {
  return (
    <AnimatedGroup className={`${className} framer-cms-gallery`.trim()} stagger={0.045} amount={0.14}>
      {items.map((item, index) => (
        <MotionCard
          className="note-card reveal is-visible"
          href={item.href}
          key={item.href}
          hover={{
            y: -10,
            rotateX: index % 2 === 0 ? 1.5 : -1.5,
            rotateY: index % 2 === 0 ? -2 : 2,
            scale: 1.015
          }}
        >
          {renderItem(item, index)}
        </MotionCard>
      ))}
    </AnimatedGroup>
  );
}
