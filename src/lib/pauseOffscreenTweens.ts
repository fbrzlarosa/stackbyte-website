import { gsap } from "gsap";

type TweenState = {
    elements: Element[];
    visible: Set<Element>;
    pausedByUs: boolean;
};

/**
 * Pauses infinite (repeat: -1) GSAP tweens while none of their DOM targets is
 * in (or near) the viewport, and resumes them when one comes back. Ambient
 * loops (orbs, glows, floating shapes) otherwise keep ticking and dirtying
 * layers for sections the user is not looking at.
 *
 * Only tweens paused by this helper are resumed, so component-level
 * pause/resume logic is never overridden. Returns a cleanup function.
 */
export function pauseOffscreenTweens(): () => void {
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
        return () => {};
    }

    const states = new Map<gsap.core.Tween, TweenState>();
    const tweensByElement = new Map<Element, Set<gsap.core.Tween>>();

    const apply = (tween: gsap.core.Tween, state: TweenState) => {
        const shouldRun = state.visible.size > 0;
        if (!shouldRun && !tween.paused()) {
            tween.paused(true);
            state.pausedByUs = true;
        } else if (shouldRun && state.pausedByUs) {
            tween.paused(false);
            state.pausedByUs = false;
        }
    };

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                tweensByElement.get(entry.target)?.forEach((tween) => {
                    const state = states.get(tween);
                    if (!state) return;
                    if (entry.isIntersecting) state.visible.add(entry.target);
                    else state.visible.delete(entry.target);
                    apply(tween, state);
                });
            });
        },
        { rootMargin: "200px 0px" }
    );

    const scan = () => {
        const live = new Set<gsap.core.Tween>();

        gsap.globalTimeline.getChildren(false, true, false).forEach((child) => {
            if (!(child instanceof gsap.core.Tween)) return;
            if (child.repeat() !== -1) return;
            live.add(child);
            if (states.has(child)) return;

            const elements = child
                .targets()
                .filter((t): t is Element => t instanceof Element);
            if (elements.length === 0) return;

            const state: TweenState = {
                elements,
                visible: new Set(),
                pausedByUs: false,
            };
            states.set(child, state);
            let alreadyObserved = false;
            elements.forEach((el) => {
                let set = tweensByElement.get(el);
                if (!set) {
                    set = new Set();
                    tweensByElement.set(el, set);
                    observer.observe(el);
                } else {
                    // Already observed: the observer will not fire again, so
                    // seed visibility from a tween sharing this element.
                    alreadyObserved = true;
                    const known = Array.from(set)
                        .map((t) => states.get(t))
                        .find((s) => s && s.visible.has(el));
                    if (known) state.visible.add(el);
                }
                set.add(child);
            });
            if (alreadyObserved) apply(child, state);
        });

        // Drop tweens that were killed/reverted so they are never resumed.
        states.forEach((state, tween) => {
            if (live.has(tween)) return;
            states.delete(tween);
            state.elements.forEach((el) => {
                const set = tweensByElement.get(el);
                if (!set) return;
                set.delete(tween);
                if (set.size === 0) {
                    tweensByElement.delete(el);
                    observer.unobserve(el);
                }
            });
        });
    };

    const intervalId = window.setInterval(scan, 1000);
    scan();

    return () => {
        window.clearInterval(intervalId);
        observer.disconnect();
        states.forEach((state, tween) => {
            if (state.pausedByUs) tween.paused(false);
        });
        states.clear();
        tweensByElement.clear();
    };
}
